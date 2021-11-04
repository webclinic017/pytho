use pyo3::prelude::*;
use pyo3::wrap_pyfunction;
use pyo3::types::{PyDict, PyList};

use std::rc::Rc;
use std::collections::HashMap;
use std::io::Error;

use alator::broker::sim::SimulatedBroker;
use alator::broker::Quote;
use alator::data::{DataSourceSim, DefaultDataSource};
use alator::perf::PortfolioPerformance;
use alator::portfolio::SimPortfolio;
use alator::simulator::Simulator;
use alator::trading::{LastBusinessDayTradingSchedule, TradingSystem, TradingSchedule};
use alator::data::universe::StaticUniverse;

pub struct FixedWeightTradingSystem {
    target_weights: HashMap<String, f64>,
}

impl TradingSystem for FixedWeightTradingSystem {
    fn calculate_weights(&mut self) -> HashMap<String, f64> {
        self.target_weights.clone()
    }

    fn should_trade_now(&self, date: &i64) -> bool {
        LastBusinessDayTradingSchedule::should_trade(date)
    }
}

impl FixedWeightTradingSystem {
    pub fn new(weights: HashMap<String, f64>) -> FixedWeightTradingSystem {
        FixedWeightTradingSystem {
            target_weights: weights,
        }
    }
}

fn insert_quote(symbol: &String, price: &f64, date: &i64, existing: &mut HashMap<i64, Vec<Quote>>){
    let q = Quote {
        symbol: symbol.to_owned(),
        bid: price.to_owned(),
        ask: price.to_owned(),
        date: date.to_owned()
    };

    if existing.contains_key(date) {
        let mut current = existing.get(date).unwrap().to_owned();
        current.push(q);
        existing.insert(date.clone(), current);
    } else {
        existing.insert(date.clone(), vec![q]);
    }
}

#[pyfunction]
fn fixedweight_backtest(assets: &PyList, weights: &PyDict, data: &PyDict) -> Result<bool, Error>{
    let assets_r: Vec<&str> = assets.extract()?;
    let weights_r: HashMap<String, f64> = weights.extract()?;
    let data_r: HashMap<i64, HashMap<String, HashMap<i64, f64>>> = data.extract()?;

    let mut raw_data: HashMap<i64, Vec<Quote>> = HashMap::new();
    for (asset, prices) in data_r {
        let open: &HashMap<i64, f64> = prices.get(&String::from("Open")).unwrap();
        let close: &HashMap<i64, f64> = prices.get(&String::from("Close")).unwrap();

        for (date, price) in open {
            insert_quote(&asset.to_string(), price, date, &mut raw_data);
        }

        for (date, price) in close {
            insert_quote(&asset.to_string(), price, date, &mut raw_data);
        }

    }

    let universe = Rc::new(StaticUniverse::new(assets_r));
    let initial_cash = 1e6;

    let dates = raw_data.keys().map(|d| d.clone()).collect();
    let source: DataSourceSim<DefaultDataSource> =
        DataSourceSim::<DefaultDataSource>::from_hashmap(raw_data);
    let rc_source = Rc::new(source);

    let simbrkr = SimulatedBroker::new(Rc::clone(&rc_source));
    let port = SimPortfolio::new(Rc::clone(&universe));
    let fws = Box::new(FixedWeightTradingSystem::new(weights_r));
    let perf = PortfolioPerformance::new();

    let mut sim = Simulator::new(dates, port, simbrkr, fws, perf, initial_cash);
    sim.run();
    println!("{:?}", sim.calculate_perf());
    Ok(true)
}


#[pymodule]
fn backtest(py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(fixedweight_backtest, m)?).unwrap();
    Ok(())
}