import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {
  AthenaApp as App,
} from '../index.js';

jest.mock('axios');

const securitySearchResponse = {
  data: {
    coverage: [
      {
        id: 14651,
        country_name: 'united kingdom',
        name: 'Random Name',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
      {
        id: 14652,
        country_name: 'united kingdom',
        name: 'Random Name 1',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
      {
        id: 14653,
        country_name: 'united kingdom',
        name: 'Random Name 2',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
    ],
  },
};

const attributionResponse = {
  'regression': {
    'intercept': 0.06163120754054625,
    'coefficients': [
      {
        'name': '666',
        'coef': 0.043669512767151614,
        'error': -1,
      },
    ],
  },
  'avgs': [
    {
      'name': '666',
      'avg': 0.05815491559086397,
    }, {
      'name': '14678',
      'avg': 0.064170804369414,
    },
  ],
  'min_date': 1504742400,
  'max_date': 1634860800,
};

const rollingAttributionResponse = {
  'regressions': [
    {
      'intercept': 0.08807134600022838,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0018892282843539971,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0868012741538811,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.028108805648767762,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08985495122120886,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.026903344137117483,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06671618998599996,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06588644830104934,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06005490046649157,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07172928885535869,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06105830797552291,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.059508549787874405,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09465385384451205,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04184897569437984,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12605980846417447,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.043250332789357394,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11303767453074359,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03992228698502438,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09921896300878301,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.030615062874764055,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08438982399620971,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07771575748501014,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07281052886421936,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.17037939745396338,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.058461994834792134,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.051365642018801214,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06556322361372288,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03959337701428537,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.054726215473488236,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.130519769923384,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03667852145969121,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08144217850503112,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04968777789656574,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11086019467489798,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04962981287879515,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10987820082734785,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04782562628239885,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11509536944372409,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03721780892876327,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10994069370154623,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.053131289411297876,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10933933390528566,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03886923602386923,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10374628912969198,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023118567819077663,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10752794228094209,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.029116036948842523,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1064757180045207,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.025922910804573665,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08929870151103118,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03266473566962726,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10538129895726779,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.038251732129413275,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0886146603111651,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04264229079083496,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08766372897679833,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03729173570129186,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1030350139573733,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.012640235879446262,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09181551430616132,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.011097282820240528,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09826617891364826,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.020023768797446922,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10040985955480221,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023634781488954797,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10264154854923584,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.022092970418852005,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10902327118868176,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.030616975041717627,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12890339435342024,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.030842513338602974,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12906898720748708,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.017487777372378478,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11658967887037175,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.010608152489684207,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11788333238991211,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0151630552040289,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1258603049151378,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.009103655091947185,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1253433019805111,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0031432425295351034,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12675899814706068,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.018590392746221988,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14966171385735294,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.037181317788960784,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1823703090629971,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05903926070556587,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11206869771437922,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02963524199937071,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06523876936058104,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04560613938708713,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07014496770953467,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03443478819102772,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0766516319060241,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.041477983352898734,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07229313721189451,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03957096123232934,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07511373606852875,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02838471523587356,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08242259398331542,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.009132558477963834,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06425762679257425,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03410262007434525,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04456134968399296,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.020395625527825804,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03778171023724378,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029890868277785032,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0341442880177619,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03613615778618378,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03580770812609605,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.039565222649572726,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03616235005788424,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03948465985904667,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03645003750817147,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.014253989432774753,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03642919946482515,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.00507232769905494,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.045600295334311654,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011195050528295674,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.049864762104612784,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.014396474815383517,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04999617487472694,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.007404421639908766,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04461914016670072,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03557252560670637,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04286443380602715,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04201939341750303,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04154514072864755,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0009446416290331816,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04686011013883714,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.003183555799382406,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04030179079026593,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.009344412413690276,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0394552775968576,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0027589698238416425,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.035571000916202834,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.01211711467877639,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03745654559820678,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.00028832277722540484,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04743777508606748,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.003363510852218406,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.040632845757075514,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.00015136638222082986,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03812513047301234,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.011278110550880861,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04380800051991424,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.020303829293399432,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04465327648963887,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023234238643876914,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04471199539081817,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026644722546288375,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04475493144137163,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.020558843589009126,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.043511150400089016,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026553240281416625,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04086986993392838,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03304089374001461,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.042493558943747595,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.044678702807534026,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04888435719178638,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0419753686106525,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04662481312989299,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.033166187775527115,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.042122066355773743,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03620138604274366,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03999784076152479,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03630131123616518,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0392583226352458,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.033755807515773534,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.039411353155700886,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0277659438528727,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03330750424350137,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04602595742872872,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03361685855851576,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04262871455057049,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.030424450209289574,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04860531638862244,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03271331728186433,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05418984180146064,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03340277928630322,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.045206498480170526,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.029320996073690472,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04241850340780979,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.026006657159035027,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03654570911261154,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02482669146686777,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06586859348693455,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.024716375701130944,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06901745727579235,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.024516553969099745,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0780306070930034,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.023093592083115413,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05102755633426689,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.030462116583891367,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06200878732273048,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03160052963134893,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06805259705445513,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.031896451274441684,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07416260693856538,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03170671941139505,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08574822711364292,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.016060659693447065,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10080493566437047,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03240949043376671,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1140934862524189,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01252476231384841,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10430679968332573,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.016094067515317462,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11148432487429176,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05649947384692654,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1329468346459278,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.028932135445343662,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1152340323216178,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.055322387157199886,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1174554599056563,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05640095916211959,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10527925073538505,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06769647474284894,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.109772918702385,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06996232125470192,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09513728145015726,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07346379232330565,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11055014678897743,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06625973799210202,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11438364464028397,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06523741815459962,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12257179550912013,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.061836353834219815,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12951313255178126,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05033485448771811,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12024608312570362,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06487492045983595,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12808460909526706,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.052052726208542004,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1204776074468094,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05308547366635067,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13245934353668043,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07478191889780293,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1771227979892314,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.058879730495810516,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17305147756082262,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06620494047581253,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15809857168312857,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06676734358869403,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15562030379818118,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06774741650283389,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1549122602011442,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06794498450757316,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14102711817588431,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10028040908378771,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13620211300519397,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09983963771632805,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14118716223905828,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10327473200251402,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.134834027195358,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09365775357719877,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12835817195614313,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12337807915756568,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.139940091680558,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12234966584622278,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14146049509660627,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1263109832829316,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18111321064109132,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18995453071882934,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.225436294923549,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2847677785327132,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.23160661817673892,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20057365970039773,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.20552471183185322,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12326648060849407,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.21416910055023078,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.13250380943621234,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.21212204102845797,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1533035142942751,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2085648122929905,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1378836253135593,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2051844705151796,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.14634769488871277,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19361874226076028,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.16169589899257228,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18550174013163526,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1476283003359637,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19907444419668074,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07734054676730054,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1855537687722049,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05998941162191291,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19017980579609503,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04379562612611214,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1917776581730055,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05039091774342454,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19086287021474665,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0451469551690591,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1903779697030194,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04848676944864592,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.181803868535914,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05091647954199273,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18658694292501696,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06424391439219056,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18886675999565472,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07757442394123046,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1866100490900238,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07721389513785669,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18432550412056276,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07566592728721672,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19599553079348092,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05981837925888493,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.173520847142388,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.023163667441655954,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13579941461823364,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.019956792210589058,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13402939318798415,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.004186528267564747,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13451690380704878,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.005716002504959188,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13549952648859953,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.006471768670819849,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14383968158248178,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.012467464791972218,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14206051770745343,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.034361563626664184,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11922869181667023,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.016966545283326584,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11416879947951093,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.019330653772232087,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10669941643922279,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04726447400473575,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09393250424430186,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06746104375568626,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10789734109033168,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07405407863513513,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11450218268410302,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08589595752176649,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11083381197715378,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07541783402253296,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11052746179916294,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07386744288523617,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11044540540731124,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07045316620393896,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10812947933871202,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10268190567235046,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10833307284534924,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09828828510581217,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1106061280227319,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09803317235323006,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0987985335969907,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0899288002093834,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08161478530533661,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04444783726032518,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.056555980598058324,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0067443871545918264,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.049155490767282595,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04664146856612005,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023441815128836023,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08905398473149453,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02124026438232063,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15738964015477247,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.014848821621188807,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.33433547566378424,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.037388217051642844,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.28320413145503265,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.018183822949860543,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.27392533614670733,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03036058683792886,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.23003842554285592,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0029353087702377392,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.23027560209032127,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.002035799505923952,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.20755149948237084,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0015429480904888804,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.20897957407741818,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0014448907091608623,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.20833451947554857,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.003446598056970744,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.21849579909315534,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0037559895177494453,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1651734884932756,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029995303051572927,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09297770782322115,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011007628302530425,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03445944534671493,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.024442425030162453,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04369162878296216,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.028644734965448167,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03618089897905915,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.005634669743797739,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05806882909271137,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.004370428761668106,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07371504660836732,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01055976655561683,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07792729076104386,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0006611481472976205,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08332988275695122,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0021732317858167843,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08068876870997008,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.012419944148960489,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07479131282094871,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.014041706872830318,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06917772508950476,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.014387259225112444,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06539620321212157,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02481495509593384,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.051942159087997826,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.008655979814128072,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04350547808508588,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.010841365114226415,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0400108247506917,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.013740358570621733,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.046108028188321035,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.005563987709551589,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0527075537697748,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.002057109849412381,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03625147066163313,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.037427475406993496,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07864435413929388,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.044207042664458386,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07194354958048037,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04069548488489777,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06909446850749838,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0668571446729672,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06402608482061065,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.049349375552514174,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07474802569231473,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.049068878318451185,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06372227048645988,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.020715013493106116,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.058844782597560895,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029299499769600536,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05304825388195824,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.015181192254722805,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06914487825944382,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0053786808725750195,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.059143755272636135,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.019361448426778987,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06342723366082277,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.005709874523157648,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04425672702239797,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 6.763451725513934e-05,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05029127917809458,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.011507274180945052,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05088165180412414,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026051013629022356,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05870115236569896,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.003470547206008561,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.050264188140321416,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0029530220802416584,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.031715191199931034,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.020091865406582796,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08201948297413829,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0458822185856599,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07911008214084651,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03956614300253332,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07690913526966292,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05592950927224259,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09505229843981804,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06305875243696217,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11294038485431977,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.07109638997701447,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1395739211419037,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05851320415408357,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15334547482114036,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04464023394528379,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15656704158532972,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05841322140821194,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14884794846939958,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04258320054817063,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1526058484627831,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04164266557817486,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1497071988541915,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.08305336549516776,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07363863270577714,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.060367697642494236,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08615249399260122,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05363101377946952,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09120175472873994,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04905010049323741,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09616686744316337,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.052009890867137754,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09503540889384146,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04723811852704446,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0943225072217045,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05237630261067037,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09734681654243774,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05710187265613383,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09453561582534242,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04010842772937167,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09716127799704795,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.026043243904229137,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09267694113334199,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.009291017946161686,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10211007073698802,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.015845834661057864,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10188500311959289,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.030507696205572914,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09889689005163946,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.033039406627122375,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09899151607540564,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04310288138423199,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09270473263225491,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04512892767550955,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0918388903906077,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04288811592104201,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09141339994710829,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.035428544772284715,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0936797231584739,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011125845257389865,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10741586825368807,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.004405041158765119,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11216235729713564,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.01324436387211822,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11081788340909468,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.004845952906374526,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11662207589603563,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.017349684412083198,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1154906792090744,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.020656076113381425,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11366079962598788,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.004162060607499645,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11146380664055397,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0071617781901230125,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1121684020707306,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.012147812314947904,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1171064443710146,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.014617135625631923,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11822565741120998,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03125349926021076,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11731890371476225,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03613959072766529,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10983366582412253,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05648820914294707,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10376696389830269,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.059167382027777875,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10268058213768691,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0733590291755859,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10224290801776745,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07963173532363708,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09117654705677296,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11906374715186042,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.043349349598728486,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11827550972210576,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05429424398297966,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09530169608052352,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05861585857624392,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10302787704882656,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0666095613879515,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08129475268334083,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0694951486765577,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08849089993719765,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07000330061476663,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08605239858793443,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07033916458747067,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08034186515050386,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07156139491607356,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08353522227625644,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07095837740572492,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07851938174914944,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08120152838415134,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10213865956507404,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11411968965135338,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08973194420730209,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14539155194585546,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09652487867984959,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.136843645017075,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10190116231861689,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1448238429821878,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09390094412713383,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13749087163193607,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09720669120078973,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13680063209051851,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09626560425266105,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13674747154371916,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10838167605807299,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1373022934223663,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11872101835800411,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14348462360483805,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13267186076921694,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1373985427311872,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09163994661834003,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1411190228046639,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08622702236481083,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14585971292205324,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08888765903687719,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15494070125878753,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1156319402109952,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15338445521276317,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11839732156794426,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15496150179880983,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12003730103229031,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15702187643028784,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11938404498247741,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15523230155954812,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10012963950024595,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1637760982560536,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12294192806877606,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13020282626642193,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13933102307257136,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13407218489814438,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14033780864682657,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13570824764745942,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1380505451070527,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13900096977745957,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11299639983964513,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1320641828526327,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12161010832106856,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14860742589202386,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09204234087867379,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15115062175356808,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0988234950582159,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1551124273165372,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09203809041747632,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14638917870271298,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08151490805579703,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1634843268445592,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08944282951673316,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16144444779117664,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08122628135452042,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18916101696947543,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10102991637633327,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18837417212395519,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08926317953741573,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18977353853015444,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0834976975750659,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1860984295770479,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08883742289761541,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18538611492633034,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06879931155841622,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.21367980284843813,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10689139498039403,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1335109243333552,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11423782930789664,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13654050579704016,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11270884775040563,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13877158126201805,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12832481711112095,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11089663406105797,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13894427434722975,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07094810524043482,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1782731217015953,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.01837792429673019,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1609796613176969,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.036349736043522526,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14913893983810644,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.02275913319697936,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14533200685022507,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.026581171563751473,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.139996119286521,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.020281524248685193,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16422232523171154,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.020227283463844718,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17780678707878797,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15377406709379082,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15854866350878455,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13783391555599092,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15369382017652705,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1270279374099738,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1462146375570175,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11253388477055377,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15076620050285552,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11648995115508949,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14325305729504137,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1154646113504334,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16254688718488378,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09164249095444743,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15790538747556457,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11644934543360903,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1415391606918318,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11176878946589286,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15237678207201216,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10563628468210538,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13056859848480282,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09267458677810497,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.122656804538512,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0201031624921886,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.152994683340739,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04406150225801359,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16097178080087987,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.056681342569765716,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17517032536991073,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08087441179390503,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19051721305229258,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08903877494337317,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19546305825056093,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.087352512897569,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19105597644936959,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1019989811967338,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17554594686710093,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07191005929456647,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1671237871509032,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07262711919515395,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16980577223617613,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0755900912923163,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16673515605821268,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08299797910228181,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14646413606871928,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09024598498397349,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14182528922377255,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09019926981617139,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16334844346868407,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08653276067886831,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.147274554630295,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09054397524376948,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1421256100462449,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07888199727990958,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1346343316181727,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07868044695528759,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11074490686634607,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0801505119624371,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12002502562610824,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0960932665805948,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13029567353572408,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11013554851296886,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14272124282768203,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1133709995095685,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1541602717891093,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1282407499672492,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1550003698458736,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12767516703133047,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14534668903268821,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1337441978058825,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15844341543940316,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12991481683355452,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16901973110476706,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12466403306344305,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1655370311356273,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12498968839272045,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16272829148899615,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12002739887084697,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14808954277062805,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1299879569497415,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16897513109556137,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11605540676600382,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16852351902960375,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11665204101950695,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15966769004120096,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10271094921778157,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16007236687871526,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10330287913510497,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16084594794793253,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10564198422190925,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15227653414470377,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10149797874455004,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1526420097661537,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1044808595710806,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15308477058092634,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10530679946708238,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15044907426249715,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10143242778629886,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16006367545685216,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09038873608053001,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16984276132306583,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0847631823591222,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15175230932388162,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11272748293042059,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14171745427518614,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12227433633079252,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12499164924840356,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16943988473315394,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12844384564040418,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.2543669899169827,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10049365273056367,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18613335250946347,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10760336784377555,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.19664596262913966,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10395075178399688,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.19325400847969745,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1262963049193367,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1628188505798699,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11563564470505139,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1574578620061522,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09225590401805203,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12232272292379996,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11809365360729969,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06672786551373863,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09004127839129475,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0570786494608011,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09388677287916372,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06628285874590828,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10169728347916948,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08489375718810416,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1256880103332741,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.060680565398729694,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11932795119928151,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04960637124147187,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1213975156421311,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04932465196201137,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11704720720517335,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0807091130787719,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09865694034639683,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08695294588768682,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1002319613014695,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08918205802969063,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11314851623484246,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09776423241966169,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12250276012457673,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09856811694018609,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12356888605920688,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09252707416340847,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09644803114190617,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06854640382538246,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09294217084269324,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06565836148800687,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09507885005348891,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06427564849439842,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0859913229909119,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0646244046212634,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07029171678013377,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06466460222615959,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05975346278662486,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06009651276574925,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07921048500371544,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.058289026401120124,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07026531748937391,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.057989850249370437,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06488403264770623,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05665837123664041,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07473862898118963,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05508181586529112,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06669568435364583,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05797766654050901,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07433115040360996,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06030305846708975,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07286884305781113,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0631605707391776,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08311792046533034,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07449863995716666,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0741597276232774,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06846602221347987,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0476133024900472,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04110792301577786,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04901184659974323,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04598480811837416,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05637145585591806,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04019987611470137,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.044897700976627715,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03230396908559188,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04014745969912453,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0313849059679296,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03544594880414712,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.041606547547632225,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026323274070042018,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.026071739620089365,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02932612391954181,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04633984540085618,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.051789995123661656,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03088493625538736,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0598445408536558,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.027718500057801247,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.040459802681628604,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.020165335129804392,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05540844967471656,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01608638108326675,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.046430211835991574,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02279180204839016,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04179380729585171,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.006472664726625443,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01813423908804278,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.015848721945117192,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01317349161114362,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.022137324575866237,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011075880654055827,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03388201679309557,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.021067557515978188,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.030848148646564034,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03247470640364061,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04590009043653135,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.032605924394634576,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05101948950316137,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03972151039564786,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0531197251048784,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.037129037268402075,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0522450538706628,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03683230274706823,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06163780543118229,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029492627857480035,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05724794914021552,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03012218984635889,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05838837893503335,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029808069174606832,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.053913339112211814,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02508691777027839,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.055133333621403206,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02394337302984991,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05449552179232453,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.016466872233753666,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05281597200382431,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.014686045121947322,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04734319901781756,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.026868095887550104,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05283614689465766,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03390258526374845,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06329354852741971,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03621771960869103,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06422067057181413,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05564837864245473,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07758592722304539,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05771683026560894,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07669446526089514,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04518550630661045,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0793205321046963,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.045126663370478146,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07947157481694155,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04720370106386138,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08114170200247708,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.042506456249488234,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08122693109653402,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.042685558000724544,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08497420276810866,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03830064937332602,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08631510154667477,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06192221376784565,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07729113979836291,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06116493126392002,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07430656397846143,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0472998143148085,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06652974070162604,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04192394149387175,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06524512373705146,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03709150550519452,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06233182392676341,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03760702782394512,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06651202400790891,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.041207956952618384,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.059855554045701496,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05592473643254624,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04695007815022458,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06308741205237156,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05289765383600395,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.08160693682509722,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.049029108496763334,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.09029323828787134,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04363672296454905,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.08024818345522412,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0568480039248283,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.07737186624795293,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06424878878616416,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0693841510322475,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06773363810958437,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.029956309961817876,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.16645954561662568,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02313715300276141,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12068779258274497,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03062679184781515,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.106849869593292,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.01858036410230254,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.13009582241720363,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.038882594923180386,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10236506131709822,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.031118345244347718,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11433910609570118,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.012035326163015014,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08201969937570136,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.01706452946139222,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.021578297833166286,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.009883372867305323,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.015850578257554145,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.000232723894621058,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.036822032014680796,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011095407192360546,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07476322905100191,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04899576022401899,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.037389988244401984,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03965444004523713,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.01770038319785362,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.030481224249197254,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.038915089651992946,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.020583969556124442,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12507002996906738,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.006626379286034868,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.15484971714117415,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0006491818461240376,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.16537624360726821,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.006206849792888287,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18052940737601111,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0013529951583223926,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18107655776497633,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.002667550223250128,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.15467419038062158,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01530481948474947,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10709019285969604,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0190284771160881,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11128480394769959,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.016102321716605326,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09815186387658698,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03637780603898745,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09203103659976532,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04972871365781577,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0886838608284125,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05459649995816127,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07475326892465413,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04550601775401723,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07879567275447807,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05776909281652038,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09305606393610046,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04132675114423509,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.016005264253776148,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03396448452481168,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03528459579601589,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04354194846317309,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.039731913325018776,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.034815444939103705,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04366312582970844,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.027461871717039912,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.016933898110265074,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.017710077527814512,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03587401788012467,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0300846233391158,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.027636424759077228,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04431909999346673,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06283387536820526,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.038703135570045864,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08058186777457196,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04115365865693221,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07723684766358667,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04573213441566217,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07847633035646719,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04737422948180164,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08895471257046876,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.048065223804685545,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05939765156454195,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05759539831458199,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0935837942957464,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05563834016387749,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06523267019792499,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03473629545843963,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09370193352865105,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03251256264291612,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11992646257805195,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05364760715422337,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.14306009771496814,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.034507758459112386,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.18801370075711404,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.038379033223676265,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.31468869711343606,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.003042270277659801,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.45376940158049117,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.011636291525710342,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.4966765110877289,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01308428877419996,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.3394130648186846,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.017581335004329023,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.3851252902815833,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.026564545167822057,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.31681317021838296,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04716160198800727,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1864538607347093,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.018209786326817884,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09529712400594385,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04686378423906437,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04752217363592081,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.012390745345119667,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08303975402184169,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.037161285545884215,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.29552246671814647,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05540163249093574,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.2663694440319142,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.017005354486075777,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.17630942429426558,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03573400224807349,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.2445318518082792,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.09310356670959162,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1499621694847306,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.10780759710037478,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.2076423193288336,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.11477022448052669,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.20585336193979684,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.05950070821519831,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16205335468697737,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.044374782416702105,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16335258465229685,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.049023287155964684,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16269899090907344,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.08151382483468683,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.17505680370672155,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.09289327762104757,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16099975082987114,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06631231704049441,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16541613014703885,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.07133143921648935,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.16719907105715298,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04313100491946213,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15478426248839564,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.08652581553066319,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13758306732591793,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.044725199520500455,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12950612100722192,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0624913457627934,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13579689037722983,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.10485501275120417,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12585280494675408,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.06458841986829615,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12114694894946512,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0828019486807014,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1106745360980065,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.023297839055505476,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11031847853924616,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0425923187069906,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10516796958400527,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.03564187209778231,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10698559160733095,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.04725138918414415,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10452429646887866,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.01630359815951527,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09824715233095209,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.02062568610448368,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09630518372823582,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0070375521825784704,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.10214423887302768,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03100891253710385,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09850666563057091,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.035293361840535484,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09776190951575915,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0007186786630545951,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08990327514129819,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.027763510659007964,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08991459571556709,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01931954918364519,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08892937964807833,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02604009457558011,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09014213292677814,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04353006986508424,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08998713665608399,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02441387643515865,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08712587347650488,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0021920617192396565,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08678333513996683,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.0010961558470553986,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08692941014654025,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01684078914159928,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08582067569031843,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.006660293671533216,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08538260668425549,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023358874206933257,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08537401463615746,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02751945661681665,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08415460837755093,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.022421681021189285,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08582024150150297,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.011414751633343859,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08461645189186083,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03007488531744474,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08526282948614392,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.049007860485847245,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09065568575120321,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.048954025536825034,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09027204079234478,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0525503556449996,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08928160537690172,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06416991967925742,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08812921453407278,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06004159717288817,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08811592839173815,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.047581005464694834,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08734233897574196,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0412793269990543,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08681500012553388,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05544254715174576,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08584088163255753,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05253984875118339,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08581948227803729,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.047761219722527906,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08572194392612573,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03655972257519648,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08486032850317012,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.024235544865977742,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08427897040077424,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03996633347324511,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08380404554590375,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.024472224865286465,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07993609089494519,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03688766266304992,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08099774512311231,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03443936246790051,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.08124430153026,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03838128151055533,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07959618584861242,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06024143567189868,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07308092902081072,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.007878423837905869,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06805578417088981,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.025827658970504604,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0690378303392418,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.034433477180386,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06930039020676282,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06946007565983574,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06924864625568172,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.058605743797454604,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06704915756306364,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06603710013406425,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06514626473419559,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.043608761357163156,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06415448455433921,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04053910612821836,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06462299301314067,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.040865748088674256,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06616908560636875,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.015877487067018355,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0642245531564405,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04025860259167903,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06102787966009342,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.030363863949395106,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.059352262840710865,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.038341297875123484,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.060656799900553775,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.037840376961804575,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06046172068879597,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03995147580827108,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.060536728641451945,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02971251120015832,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.060642611199384494,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04737637557399252,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05895365362883553,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.056310413147827434,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05434408927175341,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08537804529454177,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.045380538266611065,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10818585231026795,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04418526351105245,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.110505843602236,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04501222617678466,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14670814431348095,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04009422357050846,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15429548178064656,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04020219871050627,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11977590735616325,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.052015732526090236,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13569293249938064,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06089135743152758,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11915584025389449,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06716941305917264,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1519038972737152,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06143510510452962,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2268179373214484,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.009772037794976096,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2335726666512282,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.009053276381512336,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18167910262599418,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.028520737866183702,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.22952307113899723,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.027230450191576033,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2495036386014528,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0015867826105574047,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.34301536519498915,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12653758720984518,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.3285958677353145,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1435972514459136,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.26780411717066543,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10259476880239704,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2724023441264908,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10184293759593663,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2955741835349741,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11880500346814471,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.3565602533431538,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.15600648428844388,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.35031843363613413,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20269363356834078,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.3337471337753817,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20913988004867368,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.32150306403634715,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.25564652013051214,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.29075820086940896,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.23481983739435203,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.3108594943374501,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20018721528769132,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2704781187903342,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17486015422919934,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.318699993666658,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2341661336077837,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.3363740662611712,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20991527544111835,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.30606953877377063,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19256857673578898,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2991001384190171,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2117171984312089,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.23725132700131668,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19809268468697028,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2402813233184722,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18946962795553987,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.24232640582924722,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19859338453931002,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.23802645664644764,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19861931276700803,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.22228895129369278,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1651363949624185,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.26390298034827187,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19396213734251969,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.20390371708088978,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20750681963006876,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18519027145857556,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1901061354037854,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19762837292285879,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20571893051331527,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2271099231600701,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17994721175194014,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.20662848041892581,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1771439865726419,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.21125400838756314,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17402391585913718,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1945394946099153,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18144302026586898,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17721977803204,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17271557942268673,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16034145407596875,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.15819632853504229,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15508039530410814,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1497058197313401,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1510032092274147,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1518568019009081,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1613649999196558,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17607884501542387,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1346725715238047,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18074150725207566,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11112056801737234,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.17637983142115282,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13616761181495035,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18506091688538476,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1535706591700833,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20391507862068298,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17091876336815848,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1967039869119081,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15636678951751284,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1909341976579982,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1298979325518663,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.24474021583772718,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13023517480167682,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.24639161421854472,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13095892742754597,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.24579165433531644,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1259338708088377,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.23338674006568075,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13812208761156025,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.23066815924414186,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1423876279239933,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22528132171390036,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1499146303521844,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22829860007082836,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13412090660223527,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22664978625332227,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11819837441624709,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22421185113854175,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12342320421852679,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22437868141003975,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1169423578375661,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2102818007045753,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10689996593247345,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2138034379061112,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08779491214513249,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.21022331712772382,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09776105703674022,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19656703702830888,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08905058144228316,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20515780545456058,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08430871315079938,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19945114400351882,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07938266033079075,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2003255035342009,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07800435671309044,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2049507682848303,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08799518702421627,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.19299856608753221,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07872490662172474,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.20271897176617323,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.062050745898562715,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.22273117284670438,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.048488062645764836,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.2068266265213562,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05619014725667938,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.18431363433059553,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0693154172668383,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1360181403893733,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08714499094005987,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1324563992879083,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09544184816447933,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12392187989205986,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09530232631427023,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.14277962234379052,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10909136903227457,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1318629117252443,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11543380618816275,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12627668085846527,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11599553070539245,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12477405127271526,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11509006192854014,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12925391558595747,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11569900308883993,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12758549837154995,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1023569547706842,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.125228270791139,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08689847100857016,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12994482430908413,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08506497832601025,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1284124999112714,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07699475699745056,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.13074325562082842,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08464324316045606,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1320579278348117,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09551561299081184,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.13458029926357126,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09444862228032418,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1310230774817498,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09782567236297562,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12492532248548856,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08967900026952547,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1298675783308423,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08318055770741249,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1257230891380001,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07871774229575987,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12395884877605186,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07470236290076675,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1263713611544918,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09695623788995382,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1314283818259754,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08864508692148859,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1326414698655907,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07162412182619916,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11992422029562916,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09596394330121409,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12934223612601586,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11516605597950486,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12247465704413131,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08989806456963814,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1115701644673283,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10162792361966458,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09997559432804119,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0942802051395024,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10113515197407909,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10615872653121075,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09544592015577108,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10686399825228748,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10775073286888404,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11806619355277562,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11246690652732116,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10910241383931633,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10888671134065313,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11261096551157841,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10671414439047058,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08453732960675354,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11111630465637484,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10836851903166367,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11593411608347537,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10428597440044185,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12095525000722479,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09951200686568817,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12238429189383626,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09518445647692313,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12639479094970693,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08884771585923472,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1328323643424041,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08944402064107589,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1332360332437994,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08534305902321435,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.13648407643092936,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09892710057135465,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1343469766447189,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11185250676182677,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.14226551394813186,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08949807832411809,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.14227750258871558,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.056476831177353914,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.14824313102992429,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06492359639798964,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1478698803557358,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.04068274799509412,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.15548892725151844,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01509642552513579,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0998692597075932,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05627647053757024,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12009919316784307,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05911482093158295,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11507379503030675,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.060289441622386745,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11509903673361616,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.044142866149468024,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09769974364662495,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.048065209167333,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09905235966427901,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03460392831103311,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07672216436162062,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.025033875360584282,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08930257107595525,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.034887060124093025,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09495531999612437,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03999885040780979,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.12780451499612994,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0685678196942181,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1130382555829956,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09186201408377394,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11247546017626858,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.054606650589472325,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.057768483499780955,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08882311200290567,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05272852562934493,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09391832865733621,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05152940728856611,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06789081110065637,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03637125935125011,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06731531966213516,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03422431838627736,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06124218103327459,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03777565611865847,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07695830940459786,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04377844552933241,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08220544938023404,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.029699074391321446,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07095756635740881,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.011941594924409658,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0624284540032169,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.007529957906408404,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0509433755909541,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0014971619768453586,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02749135584538383,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.015982556196976926,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.008601308303776305,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0060412885592702895,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.007976113881173117,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.007473116453493585,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.003724985107611092,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.013344346591190194,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.002151915186038519,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.01220384362171716,
          'error': -1,
        },
      ],
    },
    {
      'intercept': -0.006776706992815127,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.019747452311673134,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.030584115171455206,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05528300182112237,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.025706911684620727,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0372068533856493,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.010679094149675215,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.009149387939405448,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.002204001347106988,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.023543823706977676,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.01104978626667898,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0316031832573152,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.002160921659792787,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04717292893366046,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.039470736977517865,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04541795983054569,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.038125208822150786,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.047696773152382445,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0809618708402807,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.015207005426519751,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07133321082451644,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.008081399514366927,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08834542083470234,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0009171060952691415,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08322526463327891,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.00755600105888485,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06776718161308558,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.018679468443504214,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.030985465768737515,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08247533717903845,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.023167916927196934,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0807672396077264,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026479691499855178,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11243966764756234,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03844629431215983,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11538166625863906,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03248738368885271,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11825986986102241,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.00867394610896203,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09643446530707686,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.032297279730046584,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0866408117306668,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.028264181970031974,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10426587161082713,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.025476597154935762,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10618397094136921,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.034118422668589686,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1053437808658388,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06548675738188188,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10525042659313812,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07014325453258288,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10457383793320814,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08689606529390159,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09550270044333799,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09999646440441678,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08377557275150933,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0871860086940911,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07942277856393273,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08693455173855881,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07908649849757252,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09521862664273312,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08456314103374478,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09178030912077294,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08602744234907567,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07031015490914277,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07133481042910611,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08277398885696631,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06922646627421218,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09806252592058604,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08682383905395444,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07069608916762016,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08285961880876874,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08582640326373878,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08017691287727165,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09576277156716781,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09145491956269153,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08535466555969218,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0883963713376128,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0731407826245466,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09246632822499479,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09633671910957799,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.10913484140353463,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08428692823782714,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1088238857734335,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0789658777639571,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.1074485328552738,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.070039536858554,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.11466076680558845,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06301213207073712,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.09781174533245791,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03866970821821334,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07602458668012646,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02916125787471073,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05777369554953224,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.027440162699488423,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05331570330554833,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.03663311807220219,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.05980123212431611,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.02260372976951668,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.0317203272453239,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.044265094456436935,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03561387303530346,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.039006959331366706,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.020780443685055154,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.026099166487142958,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.005721470178663349,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.042490222804030836,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.00913281468925793,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.052249462459998924,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.009211705774847478,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06275670132693097,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02450352615876048,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06291198477949178,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01635229899042576,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.047550241979323365,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.029911478472873235,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06920517940323433,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.029053501623531534,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07759553688743459,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.032063685048985276,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0768455897067105,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03423540360038649,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08574203793466334,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02365974862202151,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08580630176164775,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.030736901534026164,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.084057531193133,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.027094650711264285,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0875083609069539,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02577081357528271,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08722684780515763,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.026230974525230717,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09127279041333765,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.028340646129073183,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09033541889746247,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03184390339596165,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1032616956579377,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01025173287364429,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12119279419710693,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.029248328103118823,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1304872808130187,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02345049120678587,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1378770163605957,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06142503122006606,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14015152046736926,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.007698261484038734,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11055529831317444,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.028312655026806736,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12249620002517744,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.01586028381052544,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10704239966697499,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.019609721014300315,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1030292618810595,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.024553870752014734,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10644320951870503,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.022666595535510613,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11382012041584982,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.022217399171424335,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11883284080298846,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.023126745573786786,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11118402407131288,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.02719688330532361,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11310982539334026,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.026995373412618352,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11758353789959454,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.018912315161531575,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13196057647621218,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.02934040317052992,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1376514596934153,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.030024538240930605,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16532889913142876,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.062196802464961835,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.174251741989659,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.07360293497003152,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1820348409933133,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.06212234809541351,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16983531603078358,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.033137599665146594,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17763660981050106,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04315790751925593,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18201522060385175,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.02388193173027625,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15332849785119806,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.016907984211433254,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17007258497021266,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.017940795967906514,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.20128584609534617,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.08589138631876375,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.21400427330697055,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.04382607737536396,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.19212176777876097,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.03318070016304948,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.21003027127707144,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.020273969634172908,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.20152683584566147,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.004664259350173492,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.2007277495504197,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.017200016159943772,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17554391221703575,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01902098698865878,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17409017904746443,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.020002862966342884,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.159835620593413,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0305056095731667,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.15996882245076502,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03390408488260074,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16363489313291332,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.00042322211614017203,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1837564154590079,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.009709743210096652,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.18678297256293638,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.005763450540506164,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17359941949423482,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.016560760728728845,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17191739324413946,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.015611538132205978,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17725199465403313,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.02445491218611004,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17949180678546225,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.046568865000952406,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.16941293640143362,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05324610982256001,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1611048634810826,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.056045856578804204,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17714812523649276,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04367786532008045,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.17028214139085726,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.052469505509943816,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1418510822104832,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0570690204885389,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.14635241669559818,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07244867490583493,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1451191512021724,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07425083662362386,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1301536246090478,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05360891908019094,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12842826373722327,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.052273903244235885,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1232767800698532,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05500942226807668,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11172315648516742,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05275149467595332,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12395991842387806,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.046254336799972026,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1407990881387397,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.021850436536698315,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1391738795912211,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.01807246687948895,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11536136967918252,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05258505607941832,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12237163515537589,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06376494120976817,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11514047197030065,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06301539943012179,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1098817128245105,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.07022138279830277,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10083934759985531,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0872377295197089,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10793664539868075,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.09982387755756719,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08474017617161012,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.132917595001736,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09361663096218076,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1285153171449266,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10884383364615989,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12773623036834397,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.1144669260374627,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.13827966808642417,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09960597984468508,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.15434370795723087,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10098814238732766,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1394686452551939,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12389005415725934,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1130935534696954,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12098610594465892,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.11712386703907202,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.13396166932380457,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1535468665989243,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.12359012834619627,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1285695765339641,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.10388782315182613,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.17087919091505333,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.09912641532349163,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.1472858540885508,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.11077004927140757,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.12608312868447613,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08894905170257722,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.06300114737511796,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.08993039254905258,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.043985074319647106,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06521931377935751,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.01563949718347889,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06082612480113447,
      'coefficients': [
        {
          'name': '666',
          'coef': -0.006876359956852349,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06719583256649474,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0067943481669410985,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06714284260347254,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.006090232373226665,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06710485633959076,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.018836428225515983,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.057798899147781274,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.022314021914195913,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.05963086797177102,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.0224834242659579,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.0675640842506581,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.03287328282234935,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07562579841649304,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04484403265038037,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07095768274950788,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04973511194146004,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06723118510856266,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.045949374383914394,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.07538483958897349,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.05007069355399006,
          'error': -1,
        },
      ],
    },
    {
      'intercept': 0.06348523547843629,
      'coefficients': [
        {
          'name': '666',
          'coef': 0.04307210446298276,
          'error': -1,
        },
      ],
    },
  ],
  'averages': [
    [
      {
        'name': '666',
        'avg': 0.14455555555555558,
      }, {
        'name': '14678',
        'avg': 0.08834444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15372222222222223,
      }, {
        'name': '14678',
        'avg': 0.09112222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15778888888888892,
      }, {
        'name': '14678',
        'avg': 0.09410000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14512222222222224,
      }, {
        'name': '14678',
        'avg': 0.07627777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14205555555555557,
      }, {
        'name': '14678',
        'avg': 0.07024444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15436666666666668,
      }, {
        'name': '14678',
        'avg': 0.07024444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1481111111111111,
      }, {
        'name': '14678',
        'avg': 0.08845555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13394444444444445,
      }, {
        'name': '14678',
        'avg': 0.12026666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13286666666666666,
      }, {
        'name': '14678',
        'avg': 0.1077333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13091111111111114,
      }, {
        'name': '14678',
        'avg': 0.09521111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10664444444444446,
      }, {
        'name': '14678',
        'avg': 0.09267777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0645,
      }, {
        'name': '14678',
        'avg': 0.08379999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08315555555555557,
      }, {
        'name': '14678',
        'avg': 0.06273333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08006666666666667,
      }, {
        'name': '14678',
        'avg': 0.0687333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.038277777777777786,
      }, {
        'name': '14678',
        'avg': 0.05972222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.050333333333333334,
      }, {
        'name': '14678',
        'avg': 0.040777777777777746,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06445555555555557,
      }, {
        'name': '14678',
        'avg': 0.056833333333333305,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06323333333333334,
      }, {
        'name': '14678',
        'avg': 0.056577777777777755,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0738222222222222,
      }, {
        'name': '14678',
        'avg': 0.05632222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08483333333333336,
      }, {
        'name': '14678',
        'avg': 0.04654444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08385555555555559,
      }, {
        'name': '14678',
        'avg': 0.062299999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07108888888888891,
      }, {
        'name': '14678',
        'avg': 0.046244444444444456,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06616666666666669,
      }, {
        'name': '14678',
        'avg': 0.03023333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06924444444444447,
      }, {
        'name': '14678',
        'avg': 0.036488888888888876,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08447777777777779,
      }, {
        'name': '14678',
        'avg': 0.03346666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09554444444444446,
      }, {
        'name': '14678',
        'avg': 0.04273333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08330000000000003,
      }, {
        'name': '14678',
        'avg': 0.045633333333333324,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0699888888888889,
      }, {
        'name': '14678',
        'avg': 0.04877777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.053244444444444455,
      }, {
        'name': '14678',
        'avg': 0.042777777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.058133333333333356,
      }, {
        'name': '14678',
        'avg': 0.017977777777777773,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06956666666666667,
      }, {
        'name': '14678',
        'avg': 0.017933333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07213333333333334,
      }, {
        'name': '14678',
        'avg': 0.027266666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06591111111111111,
      }, {
        'name': '14678',
        'avg': 0.030400000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07527777777777778,
      }, {
        'name': '14678',
        'avg': 0.030299999999999983,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09278888888888889,
      }, {
        'name': '14678',
        'avg': 0.04257777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09161111111111112,
      }, {
        'name': '14678',
        'avg': 0.04266666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08177777777777777,
      }, {
        'name': '14678',
        'avg': 0.02702222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0872111111111111,
      }, {
        'name': '14678',
        'avg': 0.020888888888888877,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07038888888888886,
      }, {
        'name': '14678',
        'avg': 0.024022222222222216,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07026666666666667,
      }, {
        'name': '14678',
        'avg': 0.017911111111111096,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0680111111111111,
      }, {
        'name': '14678',
        'avg': 0.005477777777777768,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03661111111111112,
      }, {
        'name': '14678',
        'avg': -0.013111111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.011900000000000003,
      }, {
        'name': '14678',
        'avg': -0.03501111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0422888888888889,
      }, {
        'name': '14678',
        'avg': -0.05430000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02148888888888891,
      }, {
        'name': '14678',
        'avg': -0.028233333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02242222222222221,
      }, {
        'name': '14678',
        'avg': -0.044033333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.038722222222222207,
      }, {
        'name': '14678',
        'avg': -0.031466666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.051644444444444444,
      }, {
        'name': '14678',
        'avg': -0.03774444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06706666666666666,
      }, {
        'name': '14678',
        'avg': -0.03453333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08083333333333335,
      }, {
        'name': '14678',
        'avg': -0.02172222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.047366666666666654,
      }, {
        'name': '14678',
        'avg': -0.006088888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06887777777777777,
      }, {
        'name': '14678',
        'avg': -0.031033333333333326,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0554666666666667,
      }, {
        'name': '14678',
        'avg': -0.018299999999999993,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06546666666666667,
      }, {
        'name': '14678',
        'avg': -0.027655555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.059966666666666696,
      }, {
        'name': '14678',
        'avg': -0.03398888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06940000000000003,
      }, {
        'name': '14678',
        'avg': -0.03705555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07029999999999997,
      }, {
        'name': '14678',
        'avg': -0.03692222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07163333333333333,
      }, {
        'name': '14678',
        'avg': -0.01164444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05616666666666666,
      }, {
        'name': '14678',
        'avg': -0.0025111111111111033,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0489222222222222,
      }, {
        'name': '14678',
        'avg': -0.008755555555555548,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05015555555555554,
      }, {
        'name': '14678',
        'avg': -0.011888888888888883,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.039444444444444435,
      }, {
        'name': '14678',
        'avg': -0.005644444444444449,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04161111111111109,
      }, {
        'name': '14678',
        'avg': -0.03378888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04994444444444444,
      }, {
        'name': '14678',
        'avg': -0.03994444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04505555555555554,
      }, {
        'name': '14678',
        'avg': 0.0011666666666666763,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03239999999999998,
      }, {
        'name': '14678',
        'avg': -0.0018777777777777697,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.033511111111111096,
      }, {
        'name': '14678',
        'avg': -0.008022222222222227,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.026022222222222214,
      }, {
        'name': '14678',
        'avg': -0.0018333333333333387,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02804444444444444,
      }, {
        'name': '14678',
        'avg': -0.01106666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03231111111111112,
      }, {
        'name': '14678',
        'avg': 0.0012444444444444543,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.026055555555555533,
      }, {
        'name': '14678',
        'avg': 0.0044222222222222015,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04039999999999999,
      }, {
        'name': '14678',
        'avg': 0.001388888888888868,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05173333333333333,
      }, {
        'name': '14678',
        'avg': 0.013544444444444423,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.051422222222222216,
      }, {
        'name': '14678',
        'avg': 0.022599999999999978,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.052911111111111096,
      }, {
        'name': '14678',
        'avg': 0.025599999999999977,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04443333333333332,
      }, {
        'name': '14678',
        'avg': 0.028633333333333327,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0469111111111111,
      }, {
        'name': '14678',
        'avg': 0.022599999999999974,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.051711111111111104,
      }, {
        'name': '14678',
        'avg': 0.028666666666666663,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03956666666666667,
      }, {
        'name': '14678',
        'avg': 0.034722222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04066666666666667,
      }, {
        'name': '14678',
        'avg': 0.04666666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0327,
      }, {
        'name': '14678',
        'avg': 0.04349999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02850000000000002,
      }, {
        'name': '14678',
        'avg': 0.034366666666666636,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.024411111111111123,
      }, {
        'name': '14678',
        'avg': 0.03717777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02034444444444446,
      }, {
        'name': '14678',
        'avg': 0.037099999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008733333333333343,
      }, {
        'name': '14678',
        'avg': 0.03409999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.015033333333333348,
      }, {
        'name': '14678',
        'avg': 0.02826666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.00011111111111110135,
      }, {
        'name': '14678',
        'avg': 0.04602222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.015855555555555567,
      }, {
        'name': '14678',
        'avg': 0.04311111111111109,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.010366666666666677,
      }, {
        'name': '14678',
        'avg': 0.04894444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.012944444444444444,
      }, {
        'name': '14678',
        'avg': 0.054622222222222204,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.01758888888888887,
      }, {
        'name': '14678',
        'avg': 0.04572222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.00783333333333333,
      }, {
        'name': '14678',
        'avg': 0.04262222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008900000000000019,
      }, {
        'name': '14678',
        'avg': 0.036766666666666656,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.01071111111111114,
      }, {
        'name': '14678',
        'avg': 0.06613333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0119777777777778,
      }, {
        'name': '14678',
        'avg': 0.0693111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.005655555555555571,
      }, {
        'name': '14678',
        'avg': 0.07789999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.004566666666666661,
      }, {
        'name': '14678',
        'avg': 0.05116666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.015544444444444432,
      }, {
        'name': '14678',
        'avg': 0.06249999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.012633333333333305,
      }, {
        'name': '14678',
        'avg': 0.06845555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008888888888888875,
      }, {
        'name': '14678',
        'avg': 0.07444444444444441,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03435555555555555,
      }, {
        'name': '14678',
        'avg': 0.08629999999999996,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07283333333333333,
      }, {
        'name': '14678',
        'avg': 0.09844444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05552222222222223,
      }, {
        'name': '14678',
        'avg': 0.11478888888888884,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.045833333333333344,
      }, {
        'name': '14678',
        'avg': 0.10504444444444441,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08998888888888887,
      }, {
        'name': '14678',
        'avg': 0.10639999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06383333333333333,
      }, {
        'name': '14678',
        'avg': 0.13109999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05524444444444445,
      }, {
        'name': '14678',
        'avg': 0.11217777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0531888888888889,
      }, {
        'name': '14678',
        'avg': 0.11445555555555552,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04171111111111113,
      }, {
        'name': '14678',
        'avg': 0.10245555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02280000000000001,
      }, {
        'name': '14678',
        'avg': 0.10817777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03196666666666668,
      }, {
        'name': '14678',
        'avg': 0.09278888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04787777777777778,
      }, {
        'name': '14678',
        'avg': 0.10737777777777781,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06378888888888891,
      }, {
        'name': '14678',
        'avg': 0.11022222222222226,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06656666666666668,
      }, {
        'name': '14678',
        'avg': 0.11845555555555559,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04087777777777778,
      }, {
        'name': '14678',
        'avg': 0.12745555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03753333333333335,
      }, {
        'name': '14678',
        'avg': 0.11781111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05285555555555556,
      }, {
        'name': '14678',
        'avg': 0.1253333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06404444444444447,
      }, {
        'name': '14678',
        'avg': 0.11707777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08325555555555557,
      }, {
        'name': '14678',
        'avg': 0.12623333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08002222222222224,
      }, {
        'name': '14678',
        'avg': 0.17241111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06337777777777781,
      }, {
        'name': '14678',
        'avg': 0.16885555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05938888888888893,
      }, {
        'name': '14678',
        'avg': 0.15413333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.061966666666666705,
      }, {
        'name': '14678',
        'avg': 0.15142222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.062322222222222244,
      }, {
        'name': '14678',
        'avg': 0.15067777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05312222222222223,
      }, {
        'name': '14678',
        'avg': 0.1357,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05611111111111111,
      }, {
        'name': '14678',
        'avg': 0.1306,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.049688888888888894,
      }, {
        'name': '14678',
        'avg': 0.13605555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.041411111111111114,
      }, {
        'name': '14678',
        'avg': 0.13095555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06261111111111113,
      }, {
        'name': '14678',
        'avg': 0.12063333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.059811111111111134,
      }, {
        'name': '14678',
        'avg': 0.13262222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06733333333333337,
      }, {
        'name': '14678',
        'avg': 0.13295555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10044444444444448,
      }, {
        'name': '14678',
        'avg': 0.16203333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12767777777777778,
      }, {
        'name': '14678',
        'avg': 0.18907777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10063333333333332,
      }, {
        'name': '14678',
        'avg': 0.21142222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11954444444444443,
      }, {
        'name': '14678',
        'avg': 0.19078888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12118888888888889,
      }, {
        'name': '14678',
        'avg': 0.19811111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0979888888888889,
      }, {
        'name': '14678',
        'avg': 0.19710000000000005,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07952222222222226,
      }, {
        'name': '14678',
        'avg': 0.19760000000000005,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07376666666666669,
      }, {
        'name': '14678',
        'avg': 0.19438888888888894,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05770000000000002,
      }, {
        'name': '14678',
        'avg': 0.184288888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09085555555555556,
      }, {
        'name': '14678',
        'avg': 0.17208888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07595555555555558,
      }, {
        'name': '14678',
        'avg': 0.1932000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08480000000000006,
      }, {
        'name': '14678',
        'avg': 0.18046666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07793333333333335,
      }, {
        'name': '14678',
        'avg': 0.18676666666666675,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08070000000000004,
      }, {
        'name': '14678',
        'avg': 0.18771111111111122,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06981111111111113,
      }, {
        'name': '14678',
        'avg': 0.18771111111111122,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06485555555555557,
      }, {
        'name': '14678',
        'avg': 0.18723333333333345,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06423333333333334,
      }, {
        'name': '14678',
        'avg': 0.17853333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07693333333333335,
      }, {
        'name': '14678',
        'avg': 0.18164444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08150000000000004,
      }, {
        'name': '14678',
        'avg': 0.18254444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08157777777777782,
      }, {
        'name': '14678',
        'avg': 0.1803111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0946111111111112,
      }, {
        'name': '14678',
        'avg': 0.17716666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08945555555555562,
      }, {
        'name': '14678',
        'avg': 0.1906444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07381111111111115,
      }, {
        'name': '14678',
        'avg': 0.17181111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07012222222222225,
      }, {
        'name': '14678',
        'avg': 0.13440000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08133333333333338,
      }, {
        'name': '14678',
        'avg': 0.13368888888888894,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08265555555555558,
      }, {
        'name': '14678',
        'avg': 0.13404444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09106666666666674,
      }, {
        'name': '14678',
        'avg': 0.13608888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09943333333333342,
      }, {
        'name': '14678',
        'avg': 0.14260000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08551111111111113,
      }, {
        'name': '14678',
        'avg': 0.13912222222222226,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07962222222222223,
      }, {
        'name': '14678',
        'avg': 0.1178777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07483333333333332,
      }, {
        'name': '14678',
        'avg': 0.11272222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06581111111111111,
      }, {
        'name': '14678',
        'avg': 0.10358888888888891,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07262222222222221,
      }, {
        'name': '14678',
        'avg': 0.08903333333333337,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07123333333333333,
      }, {
        'name': '14678',
        'avg': 0.10262222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07492222222222221,
      }, {
        'name': '14678',
        'avg': 0.1080666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06895555555555555,
      }, {
        'name': '14678',
        'avg': 0.10563333333333337,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06625555555555555,
      }, {
        'name': '14678',
        'avg': 0.10563333333333337,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07224444444444444,
      }, {
        'name': '14678',
        'avg': 0.10535555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0640222222222222,
      }, {
        'name': '14678',
        'avg': 0.10155555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07155555555555554,
      }, {
        'name': '14678',
        'avg': 0.10130000000000004,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06749999999999998,
      }, {
        'name': '14678',
        'avg': 0.10398888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07053333333333332,
      }, {
        'name': '14678',
        'avg': 0.09245555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06407777777777775,
      }, {
        'name': '14678',
        'avg': 0.07876666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07077777777777777,
      }, {
        'name': '14678',
        'avg': 0.057033333333333325,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05622222222222221,
      }, {
        'name': '14678',
        'avg': 0.05177777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06228888888888886,
      }, {
        'name': '14678',
        'avg': 0.028988888888888863,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.01372222222222218,
      }, {
        'name': '14678',
        'avg': 0.023399999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.014111111111111137,
      }, {
        'name': '14678',
        'avg': -0.019566666666666694,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0008999999999999527,
      }, {
        'name': '14678',
        'avg': -0.037133333333333365,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.015188888888888903,
      }, {
        'name': '14678',
        'avg': -0.02234444444444448,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.00948888888888887,
      }, {
        'name': '14678',
        'avg': -0.0281777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.005733333333333318,
      }, {
        'name': '14678',
        'avg': 0.004255555555555526,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.011444444444444452,
      }, {
        'name': '14678',
        'avg': -0.004411111111111123,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01377777777777778,
      }, {
        'name': '14678',
        'avg': -0.004422222222222242,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.014077777777777797,
      }, {
        'name': '14678',
        'avg': -0.00437777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.022944444444444448,
      }, {
        'name': '14678',
        'avg': -0.001566666666666689,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05610000000000001,
      }, {
        'name': '14678',
        'avg': -0.013022222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03303333333333336,
      }, {
        'name': '14678',
        'avg': -0.03306666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.04782222222222224,
      }, {
        'name': '14678',
        'avg': -0.012655555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.057011111111111124,
      }, {
        'name': '14678',
        'avg': -0.026933333333333326,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03254444444444448,
      }, {
        'name': '14678',
        'avg': -0.029822222222222215,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.02255555555555558,
      }, {
        'name': '14678',
        'avg': -0.006944444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0044222222222222015,
      }, {
        'name': '14678',
        'avg': -0.0040444444444444495,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.005044444444444472,
      }, {
        'name': '14678',
        'avg': 0.010166666666666636,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.010733333333333319,
      }, {
        'name': '14678',
        'avg': 0.0015555555555555373,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.010822222222222205,
      }, {
        'name': '14678',
        'avg': -0.0013000000000000283,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03354444444444442,
      }, {
        'name': '14678',
        'avg': -0.009911111111111119,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.027344444444444414,
      }, {
        'name': '14678',
        'avg': 0.01593333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.022622222222222207,
      }, {
        'name': '14678',
        'avg': 0.01586666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.008844444444444474,
      }, {
        'name': '14678',
        'avg': 0.024355555555555547,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.019911111111111122,
      }, {
        'name': '14678',
        'avg': -0.00952222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03812222222222223,
      }, {
        'name': '14678',
        'avg': -0.012366666666666672,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.030211111111111116,
      }, {
        'name': '14678',
        'avg': -0.015133333333333325,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.019866666666666685,
      }, {
        'name': '14678',
        'avg': -0.006611111111111103,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.048077777777777775,
      }, {
        'name': '14678',
        'avg': -0.00379999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06944444444444445,
      }, {
        'name': '14678',
        'avg': -0.04288888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06492222222222223,
      }, {
        'name': '14678',
        'avg': -0.04887777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.07661111111111112,
      }, {
        'name': '14678',
        'avg': -0.045988888888888885,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06175555555555556,
      }, {
        'name': '14678',
        'avg': -0.07081111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05374444444444445,
      }, {
        'name': '14678',
        'avg': -0.05336666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.027166666666666665,
      }, {
        'name': '14678',
        'avg': -0.05080000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03165555555555557,
      }, {
        'name': '14678',
        'avg': -0.02257777777777781,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.027866666666666675,
      }, {
        'name': '14678',
        'avg': -0.030777777777777744,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.02582222222222219,
      }, {
        'name': '14678',
        'avg': -0.016966666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05841111111111109,
      }, {
        'name': '14678',
        'avg': -0.008833333333333358,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.052811111111111135,
      }, {
        'name': '14678',
        'avg': -0.022711111111111137,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.07233333333333335,
      }, {
        'name': '14678',
        'avg': -0.008911111111111106,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.07580000000000002,
      }, {
        'name': '14678',
        'avg': -0.003744444444444454,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.07504444444444446,
      }, {
        'name': '14678',
        'avg': 0.007688888888888874,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.0745,
      }, {
        'name': '14678',
        'avg': 0.021677777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.07987777777777776,
      }, {
        'name': '14678',
        'avg': -0.000544444444444456,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.10502222222222218,
      }, {
        'name': '14678',
        'avg': -0.00037777777777780276,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.13123333333333329,
      }, {
        'name': '14678',
        'avg': -0.030855555555555577,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1308444444444444,
      }, {
        'name': '14678',
        'avg': -0.05623333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14635555555555552,
      }, {
        'name': '14678',
        'avg': -0.05082222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.15597777777777777,
      }, {
        'name': '14678',
        'avg': -0.07075555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.17439999999999997,
      }, {
        'name': '14678',
        'avg': -0.08275555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.21162222222222218,
      }, {
        'name': '14678',
        'avg': -0.10063333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.19366666666666663,
      }, {
        'name': '14678',
        'avg': -0.08821111111111109,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.20384444444444436,
      }, {
        'name': '14678',
        'avg': -0.07655555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1980999999999999,
      }, {
        'name': '14678',
        'avg': -0.08789999999999995,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1993888888888888,
      }, {
        'name': '14678',
        'avg': -0.07301111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.22919999999999988,
      }, {
        'name': '14678',
        'avg': -0.07595555555555551,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.19059999999999988,
      }, {
        'name': '14678',
        'avg': -0.09708888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1809333333333332,
      }, {
        'name': '14678',
        'avg': -0.07595555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1770444444444443,
      }, {
        'name': '14678',
        'avg': -0.06977777777777773,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.17278888888888877,
      }, {
        'name': '14678',
        'avg': -0.06566666666666658,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.17409999999999995,
      }, {
        'name': '14678',
        'avg': -0.06855555555555547,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.16934444444444435,
      }, {
        'name': '14678',
        'avg': -0.06321111111111108,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.17533333333333326,
      }, {
        'name': '14678',
        'avg': -0.0694444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.16158888888888875,
      }, {
        'name': '14678',
        'avg': -0.07237777777777774,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.15601111111111102,
      }, {
        'name': '14678',
        'avg': -0.05526666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1435222222222221,
      }, {
        'name': '14678',
        'avg': -0.03934444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1264222222222221,
      }, {
        'name': '14678',
        'avg': -0.022199999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14426666666666657,
      }, {
        'name': '14678',
        'avg': -0.03054444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14597777777777765,
      }, {
        'name': '14678',
        'avg': -0.04494444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14484444444444433,
      }, {
        'name': '14678',
        'avg': -0.04737777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14127777777777767,
      }, {
        'name': '14678',
        'avg': -0.05620000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.150311111111111,
      }, {
        'name': '14678',
        'avg': -0.058933333333333324,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14574444444444434,
      }, {
        'name': '14678',
        'avg': -0.056211111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.13443333333333327,
      }, {
        'name': '14678',
        'avg': -0.048022222222222216,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.12626666666666664,
      }, {
        'name': '14678',
        'avg': -0.02468888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1339777777777777,
      }, {
        'name': '14678',
        'avg': -0.01062222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.12603333333333325,
      }, {
        'name': '14678',
        'avg': -0.027211111111111123,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1168888888888888,
      }, {
        'name': '14678',
        'avg': -0.018477777777777794,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.11789999999999999,
      }, {
        'name': '14678',
        'avg': 0.0037333333333333316,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.12464444444444435,
      }, {
        'name': '14678',
        'avg': 0.006488888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1269555555555555,
      }, {
        'name': '14678',
        'avg': -0.009988888888888882,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.12615555555555552,
      }, {
        'name': '14678',
        'avg': -0.0069888888888888666,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.11587777777777768,
      }, {
        'name': '14678',
        'avg': -0.0014222222222222236,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.11207777777777769,
      }, {
        'name': '14678',
        'avg': 0.0013666666666667148,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.11581111111111102,
      }, {
        'name': '14678',
        'avg': 0.017666666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.09464444444444434,
      }, {
        'name': '14678',
        'avg': 0.025744444444444438,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.08683333333333326,
      }, {
        'name': '14678',
        'avg': 0.04747777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.084411111111111,
      }, {
        'name': '14678',
        'avg': 0.05050000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.08675555555555546,
      }, {
        'name': '14678',
        'avg': 0.06448888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.04312222222222219,
      }, {
        'name': '14678',
        'avg': 0.0757,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01889999999999999,
      }, {
        'name': '14678',
        'avg': 0.11824444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03556666666666665,
      }, {
        'name': '14678',
        'avg': 0.11634444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.029600000000000008,
      }, {
        'name': '14678',
        'avg': 0.09356666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.056633333333333286,
      }, {
        'name': '14678',
        'avg': 0.09925555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.048688888888888865,
      }, {
        'name': '14678',
        'avg': 0.07791111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03701111111111108,
      }, {
        'name': '14678',
        'avg': 0.08590000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03786666666666665,
      }, {
        'name': '14678',
        'avg': 0.0833888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.040333333333333325,
      }, {
        'name': '14678',
        'avg': 0.07745555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.043244444444444446,
      }, {
        'name': '14678',
        'avg': 0.08046666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.011322222222222206,
      }, {
        'name': '14678',
        'avg': 0.07760000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.015722222222222228,
      }, {
        'name': '14678',
        'avg': 0.10034444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.006811111111111138,
      }, {
        'name': '14678',
        'avg': 0.09072222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.021822222222222267,
      }, {
        'name': '14678',
        'avg': 0.09951111111111109,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.003444444444444444,
      }, {
        'name': '14678',
        'avg': 0.10240000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.003077777777777763,
      }, {
        'name': '14678',
        'avg': 0.09347777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.010688888888888906,
      }, {
        'name': '14678',
        'avg': 0.09574444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.003811111111111112,
      }, {
        'name': '14678',
        'avg': 0.09574444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.013299999999999985,
      }, {
        'name': '14678',
        'avg': 0.10655555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.008200000000000002,
      }, {
        'name': '14678',
        'avg': 0.11754444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05284444444444439,
      }, {
        'name': '14678',
        'avg': 0.1254111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.050988888888888854,
      }, {
        'name': '14678',
        'avg': 0.08444444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03278888888888887,
      }, {
        'name': '14678',
        'avg': 0.08144444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.016055555555555562,
      }, {
        'name': '14678',
        'avg': 0.08639999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.010422222222222232,
      }, {
        'name': '14678',
        'avg': 0.1140333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.005466666666666654,
      }, {
        'name': '14678',
        'avg': 0.11924444444444442,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0065555555555555515,
      }, {
        'name': '14678',
        'avg': 0.12106666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.004111111111111105,
      }, {
        'name': '14678',
        'avg': 0.12002222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.024988888888888915,
      }, {
        'name': '14678',
        'avg': 0.10422222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04746666666666668,
      }, {
        'name': '14678',
        'avg': 0.12912222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.049244444444444486,
      }, {
        'name': '14678',
        'avg': 0.14593333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05768888888888894,
      }, {
        'name': '14678',
        'avg': 0.14816666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03368888888888894,
      }, {
        'name': '14678',
        'avg': 0.14273333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03393333333333334,
      }, {
        'name': '14678',
        'avg': 0.11747777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008455555555555534,
      }, {
        'name': '14678',
        'avg': 0.12286666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.018244444444444452,
      }, {
        'name': '14678',
        'avg': 0.0948,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008444444444444425,
      }, {
        'name': '14678',
        'avg': 0.10013333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.003144444444444403,
      }, {
        'name': '14678',
        'avg': 0.09157777777777781,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.030288888888888883,
      }, {
        'name': '14678',
        'avg': 0.08646666666666669,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03373333333333333,
      }, {
        'name': '14678',
        'avg': 0.0948888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06946666666666672,
      }, {
        'name': '14678',
        'avg': 0.0943666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0650777777777778,
      }, {
        'name': '14678',
        'avg': 0.11328888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0650666666666667,
      }, {
        'name': '14678',
        'avg': 0.10161111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06425555555555558,
      }, {
        'name': '14678',
        'avg': 0.09545555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06566666666666673,
      }, {
        'name': '14678',
        'avg': 0.10101111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08793333333333338,
      }, {
        'name': '14678',
        'avg': 0.08758888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10267777777777773,
      }, {
        'name': '14678',
        'avg': 0.12059999999999996,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10022222222222218,
      }, {
        'name': '14678',
        'avg': 0.1279222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12804444444444446,
      }, {
        'name': '14678',
        'avg': 0.13047777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1272222222222222,
      }, {
        'name': '14678',
        'avg': 0.14243333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14831111111111112,
      }, {
        'name': '14678',
        'avg': 0.14946666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1750777777777778,
      }, {
        'name': '14678',
        'avg': 0.17505555555555563,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.16970000000000002,
      }, {
        'name': '14678',
        'avg': 0.15481111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14426666666666665,
      }, {
        'name': '14678',
        'avg': 0.14585555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14374444444444442,
      }, {
        'name': '14678',
        'avg': 0.1415111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14882222222222222,
      }, {
        'name': '14678',
        'avg': 0.13697777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1862222222222222,
      }, {
        'name': '14678',
        'avg': 0.16045555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1415777777777778,
      }, {
        'name': '14678',
        'avg': 0.19957777777777785,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1262888888888889,
      }, {
        'name': '14678',
        'avg': 0.17595555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12495555555555554,
      }, {
        'name': '14678',
        'avg': 0.16956666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11726666666666664,
      }, {
        'name': '14678',
        'avg': 0.1594111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0990111111111111,
      }, {
        'name': '14678',
        'avg': 0.16229999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10067777777777778,
      }, {
        'name': '14678',
        'avg': 0.15487777777777773,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09721111111111108,
      }, {
        'name': '14678',
        'avg': 0.17145555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07762222222222223,
      }, {
        'name': '14678',
        'avg': 0.16694444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0774888888888889,
      }, {
        'name': '14678',
        'avg': 0.1502,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0543888888888889,
      }, {
        'name': '14678',
        'avg': 0.15812222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.036666666666666646,
      }, {
        'name': '14678',
        'avg': 0.13396666666666662,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07621111111111113,
      }, {
        'name': '14678',
        'avg': 0.12418888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08283333333333337,
      }, {
        'name': '14678',
        'avg': 0.15664444444444442,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08812222222222223,
      }, {
        'name': '14678',
        'avg': 0.16596666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09035555555555554,
      }, {
        'name': '14678',
        'avg': 0.1824777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10425555555555559,
      }, {
        'name': '14678',
        'avg': 0.19980000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10548888888888891,
      }, {
        'name': '14678',
        'avg': 0.20467777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08594444444444443,
      }, {
        'name': '14678',
        'avg': 0.19982222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08094444444444446,
      }, {
        'name': '14678',
        'avg': 0.1813666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07815555555555558,
      }, {
        'name': '14678',
        'avg': 0.1728,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07165555555555558,
      }, {
        'name': '14678',
        'avg': 0.17522222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07722222222222225,
      }, {
        'name': '14678',
        'avg': 0.17314444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08301111111111115,
      }, {
        'name': '14678',
        'avg': 0.15395555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10393333333333332,
      }, {
        'name': '14678',
        'avg': 0.1512,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10177777777777777,
      }, {
        'name': '14678',
        'avg': 0.17215555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09906666666666666,
      }, {
        'name': '14678',
        'avg': 0.15624444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0741888888888889,
      }, {
        'name': '14678',
        'avg': 0.14797777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06946666666666669,
      }, {
        'name': '14678',
        'avg': 0.14010000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07665555555555557,
      }, {
        'name': '14678',
        'avg': 0.11688888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07096666666666668,
      }, {
        'name': '14678',
        'avg': 0.12684444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07782222222222222,
      }, {
        'name': '14678',
        'avg': 0.13886666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0791,
      }, {
        'name': '14678',
        'avg': 0.15168888888888893,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09154444444444446,
      }, {
        'name': '14678',
        'avg': 0.16590000000000005,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0824111111111111,
      }, {
        'name': '14678',
        'avg': 0.1655222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07566666666666665,
      }, {
        'name': '14678',
        'avg': 0.1554666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07792222222222221,
      }, {
        'name': '14678',
        'avg': 0.16856666666666673,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0835333333333333,
      }, {
        'name': '14678',
        'avg': 0.1794333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08922222222222222,
      }, {
        'name': '14678',
        'avg': 0.17668888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08668888888888886,
      }, {
        'name': '14678',
        'avg': 0.17313333333333342,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09119999999999998,
      }, {
        'name': '14678',
        'avg': 0.1599444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0886777777777778,
      }, {
        'name': '14678',
        'avg': 0.17926666666666674,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08866666666666667,
      }, {
        'name': '14678',
        'avg': 0.17886666666666673,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1016777777777778,
      }, {
        'name': '14678',
        'avg': 0.17011111111111119,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09717777777777778,
      }, {
        'name': '14678',
        'avg': 0.17011111111111119,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08402222222222222,
      }, {
        'name': '14678',
        'avg': 0.16972222222222227,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08835555555555553,
      }, {
        'name': '14678',
        'avg': 0.16124444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08584444444444442,
      }, {
        'name': '14678',
        'avg': 0.16161111111111115,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08096666666666665,
      }, {
        'name': '14678',
        'avg': 0.16161111111111115,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08364444444444442,
      }, {
        'name': '14678',
        'avg': 0.15893333333333337,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07772222222222222,
      }, {
        'name': '14678',
        'avg': 0.16708888888888893,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.075,
      }, {
        'name': '14678',
        'avg': 0.17620000000000005,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06616666666666665,
      }, {
        'name': '14678',
        'avg': 0.15921111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0441111111111111,
      }, {
        'name': '14678',
        'avg': 0.14711111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05709999999999997,
      }, {
        'name': '14678',
        'avg': 0.13466666666666674,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.024944444444444432,
      }, {
        'name': '14678',
        'avg': 0.1347888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03143333333333332,
      }, {
        'name': '14678',
        'avg': 0.10634444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03744444444444442,
      }, {
        'name': '14678',
        'avg': 0.1149666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05429999999999999,
      }, {
        'name': '14678',
        'avg': 0.11444444444444452,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03946666666666665,
      }, {
        'name': '14678',
        'avg': 0.13272222222222227,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.013322222222222213,
      }, {
        'name': '14678',
        'avg': 0.11773333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02969999999999998,
      }, {
        'name': '14678',
        'avg': 0.09588888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.005233333333333349,
      }, {
        'name': '14678',
        'avg': 0.11774444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.004811111111111099,
      }, {
        'name': '14678',
        'avg': 0.08976666666666672,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.006066666666666677,
      }, {
        'name': '14678',
        'avg': 0.09428888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.018355555555555562,
      }, {
        'name': '14678',
        'avg': 0.10325555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.016311111111111117,
      }, {
        'name': '14678',
        'avg': 0.12667777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.021611111111111123,
      }, {
        'name': '14678',
        'avg': 0.12040000000000005,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.020999999999999998,
      }, {
        'name': '14678',
        'avg': 0.12243333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.015177777777777781,
      }, {
        'name': '14678',
        'avg': 0.11582222222222226,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.018033333333333346,
      }, {
        'name': '14678',
        'avg': 0.0970888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.011322222222222227,
      }, {
        'name': '14678',
        'avg': 0.09922222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.005299999999999998,
      }, {
        'name': '14678',
        'avg': 0.1136666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.00425555555555554,
      }, {
        'name': '14678',
        'avg': 0.12292222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01323333333333335,
      }, {
        'name': '14678',
        'avg': 0.12234444444444448,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0012444444444444308,
      }, {
        'name': '14678',
        'avg': 0.09653333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.016111111111111097,
      }, {
        'name': '14678',
        'avg': 0.09399999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.011911111111111095,
      }, {
        'name': '14678',
        'avg': 0.09584444444444441,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.010622222222222213,
      }, {
        'name': '14678',
        'avg': 0.08667777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.009922222222222206,
      }, {
        'name': '14678',
        'avg': 0.07093333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02628888888888887,
      }, {
        'name': '14678',
        'avg': 0.0613333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.031844444444444446,
      }, {
        'name': '14678',
        'avg': 0.0810666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.020333333333333328,
      }, {
        'name': '14678',
        'avg': 0.07144444444444448,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.035188888888888895,
      }, {
        'name': '14678',
        'avg': 0.0668777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.039844444444444446,
      }, {
        'name': '14678',
        'avg': 0.07693333333333337,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.043577777777777785,
      }, {
        'name': '14678',
        'avg': 0.06922222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.039466666666666664,
      }, {
        'name': '14678',
        'avg': 0.07671111111111117,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06083333333333329,
      }, {
        'name': '14678',
        'avg': 0.07671111111111117,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05181111111111107,
      }, {
        'name': '14678',
        'avg': 0.0869777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03596666666666664,
      }, {
        'name': '14678',
        'avg': 0.07662222222222229,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03292222222222222,
      }, {
        'name': '14678',
        'avg': 0.048966666666666644,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0367111111111111,
      }, {
        'name': '14678',
        'avg': 0.050699999999999946,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03829999999999999,
      }, {
        'name': '14678',
        'avg': 0.05791111111111106,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03446666666666664,
      }, {
        'name': '14678',
        'avg': 0.046011111111111065,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.023977777777777758,
      }, {
        'name': '14678',
        'avg': 0.04089999999999993,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.017322222222222194,
      }, {
        'name': '14678',
        'avg': 0.0361666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.024677777777777736,
      }, {
        'name': '14678',
        'avg': 0.026966666666666608,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.049788888888888855,
      }, {
        'name': '14678',
        'avg': 0.03163333333333329,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05248888888888887,
      }, {
        'name': '14678',
        'avg': 0.05341111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03286666666666664,
      }, {
        'name': '14678',
        'avg': 0.060755555555555535,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05764444444444442,
      }, {
        'name': '14678',
        'avg': 0.041622222222222165,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06785555555555554,
      }, {
        'name': '14678',
        'avg': 0.05649999999999996,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05619999999999998,
      }, {
        'name': '14678',
        'avg': 0.047711111111111155,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04558888888888886,
      }, {
        'name': '14678',
        'avg': 0.04208888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04983333333333333,
      }, {
        'name': '14678',
        'avg': 0.01734444444444438,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03594444444444445,
      }, {
        'name': '14678',
        'avg': 0.012377777777777746,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03383333333333332,
      }, {
        'name': '14678',
        'avg': -0.012222222222222244,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02986666666666666,
      }, {
        'name': '14678',
        'avg': -0.021988888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03976666666666667,
      }, {
        'name': '14678',
        'avg': -0.034300000000000004,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03124444444444444,
      }, {
        'name': '14678',
        'avg': -0.034200000000000015,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03619999999999999,
      }, {
        'name': '14678',
        'avg': -0.041644444444444456,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03729999999999999,
      }, {
        'name': '14678',
        'avg': -0.039077777777777774,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.031022222222222222,
      }, {
        'name': '14678',
        'avg': -0.03874444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0339,
      }, {
        'name': '14678',
        'avg': -0.03143333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.022455555555555548,
      }, {
        'name': '14678',
        'avg': -0.03143333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.027466666666666657,
      }, {
        'name': '14678',
        'avg': -0.031288888888888894,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02603333333333332,
      }, {
        'name': '14678',
        'avg': -0.02652222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0473222222222222,
      }, {
        'name': '14678',
        'avg': -0.02652222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.052799999999999986,
      }, {
        'name': '14678',
        'avg': -0.019255555555555564,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.047233333333333336,
      }, {
        'name': '14678',
        'avg': -0.016922222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.041611111111111106,
      }, {
        'name': '14678',
        'avg': -0.029066666666666678,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03612222222222224,
      }, {
        'name': '14678',
        'avg': -0.036188888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.035711111111111124,
      }, {
        'name': '14678',
        'avg': -0.03851111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02501111111111113,
      }, {
        'name': '14678',
        'avg': -0.057588888888888884,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.028755555555555565,
      }, {
        'name': '14678',
        'avg': -0.05992222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.034922222222222236,
      }, {
        'name': '14678',
        'avg': -0.04795555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0344777777777778,
      }, {
        'name': '14678',
        'avg': -0.047866666666666655,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03802222222222224,
      }, {
        'name': '14678',
        'avg': -0.050288888888888876,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03603333333333336,
      }, {
        'name': '14678',
        'avg': -0.04543333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.030244444444444425,
      }, {
        'name': '14678',
        'avg': -0.04525555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02586666666666666,
      }, {
        'name': '14678',
        'avg': -0.040533333333333324,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02788888888888889,
      }, {
        'name': '14678',
        'avg': -0.06407777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.037555555555555585,
      }, {
        'name': '14678',
        'avg': -0.06395555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04192222222222224,
      }, {
        'name': '14678',
        'avg': -0.05008888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05123333333333336,
      }, {
        'name': '14678',
        'avg': -0.04526666666666669,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05272222222222223,
      }, {
        'name': '14678',
        'avg': -0.04037777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04065555555555556,
      }, {
        'name': '14678',
        'avg': -0.0403111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02585555555555554,
      }, {
        'name': '14678',
        'avg': -0.04275555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02432222222222223,
      }, {
        'name': '14678',
        'avg': -0.05706666666666669,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.023133333333333318,
      }, {
        'name': '14678',
        'avg': -0.06431111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.026600000000000002,
      }, {
        'name': '14678',
        'avg': -0.08291111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03962222222222222,
      }, {
        'name': '14678',
        'avg': -0.0920222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.048211111111111135,
      }, {
        'name': '14678',
        'avg': -0.08298888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05698888888888888,
      }, {
        'name': '14678',
        'avg': -0.08103333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06831111111111109,
      }, {
        'name': '14678',
        'avg': -0.07401111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11093333333333336,
      }, {
        'name': '14678',
        'avg': -0.04842222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09654444444444445,
      }, {
        'name': '14678',
        'avg': -0.03478888888888891,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10363333333333333,
      }, {
        'name': '14678',
        'avg': -0.0417,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08316666666666664,
      }, {
        'name': '14678',
        'avg': -0.02939999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09004444444444444,
      }, {
        'name': '14678',
        'avg': -0.048100000000000004,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1082888888888889,
      }, {
        'name': '14678',
        'avg': -0.04350000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09737777777777776,
      }, {
        'name': '14678',
        'avg': -0.020022222222222233,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13088888888888892,
      }, {
        'name': '14678',
        'avg': -0.019888888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12793333333333337,
      }, {
        'name': '14678',
        'avg': 0.007855555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11193333333333333,
      }, {
        'name': '14678',
        'avg': -0.003888888888888876,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09205555555555554,
      }, {
        'name': '14678',
        'avg': -0.017977777777777794,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10412222222222221,
      }, {
        'name': '14678',
        'avg': -0.05288888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10426666666666663,
      }, {
        'name': '14678',
        'avg': -0.04149999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09698888888888886,
      }, {
        'name': '14678',
        'avg': -0.03425555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12974444444444447,
      }, {
        'name': '14678',
        'avg': -0.03681111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13018888888888894,
      }, {
        'name': '14678',
        'avg': -0.013533333333333338,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12835555555555558,
      }, {
        'name': '14678',
        'avg': -0.020577777777777768,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12165555555555556,
      }, {
        'name': '14678',
        'avg': -0.015755555555555547,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11776666666666667,
      }, {
        'name': '14678',
        'avg': -0.022677777777777793,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13318888888888894,
      }, {
        'name': '14678',
        'avg': -0.01793333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11946666666666668,
      }, {
        'name': '14678',
        'avg': 0.0025111111111111245,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10708888888888889,
      }, {
        'name': '14678',
        'avg': 0.0071111111111111245,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11537777777777776,
      }, {
        'name': '14678',
        'avg': 0.004777777777777792,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11976666666666665,
      }, {
        'name': '14678',
        'avg': 0.02535555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11646666666666664,
      }, {
        'name': '14678',
        'avg': 0.039399999999999984,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10875555555555552,
      }, {
        'name': '14678',
        'avg': 0.04646666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1068222222222222,
      }, {
        'name': '14678',
        'avg': 0.037088888888888866,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09757777777777776,
      }, {
        'name': '14678',
        'avg': 0.04868888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08358888888888887,
      }, {
        'name': '14678',
        'avg': 0.03998888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09188888888888884,
      }, {
        'name': '14678',
        'avg': 0.030722222222222227,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09054444444444441,
      }, {
        'name': '14678',
        'avg': 0.03994444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09399999999999999,
      }, {
        'name': '14678',
        'avg': 0.030711111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07976666666666664,
      }, {
        'name': '14678',
        'avg': 0.026111111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08793333333333332,
      }, {
        'name': '14678',
        'avg': 0.014555555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1139333333333333,
      }, {
        'name': '14678',
        'avg': 0.03323333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11958888888888887,
      }, {
        'name': '14678',
        'avg': 0.05183333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12598888888888884,
      }, {
        'name': '14678',
        'avg': 0.04885555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12589999999999996,
      }, {
        'name': '14678',
        'avg': 0.050877777777777786,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12843333333333332,
      }, {
        'name': '14678',
        'avg': 0.05581111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14393333333333333,
      }, {
        'name': '14678',
        'avg': 0.060177777777777774,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17100000000000004,
      }, {
        'name': '14678',
        'avg': 0.05822222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.16033333333333338,
      }, {
        'name': '14678',
        'avg': 0.07260000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14657777777777775,
      }, {
        'name': '14678',
        'avg': 0.06520000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14831111111111114,
      }, {
        'name': '14678',
        'avg': 0.04863333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17083333333333336,
      }, {
        'name': '14678',
        'avg': 0.05299999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15647777777777777,
      }, {
        'name': '14678',
        'avg': 0.07603333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13765555555555556,
      }, {
        'name': '14678',
        'avg': 0.060388888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08826666666666666,
      }, {
        'name': '14678',
        'avg': 0.06615555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05616666666666664,
      }, {
        'name': '14678',
        'avg': 0.02244444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04090000000000001,
      }, {
        'name': '14678',
        'avg': 0.00867777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.005944444444444446,
      }, {
        'name': '14678',
        'avg': 0.011066666666666678,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.018166666666666668,
      }, {
        'name': '14678',
        'avg': -0.024577777777777754,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.037344444444444444,
      }, {
        'name': '14678',
        'avg': -0.014733333333333317,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.001522222222222242,
      }, {
        'name': '14678',
        'avg': 0.04687777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.049333333333333305,
      }, {
        'name': '14678',
        'avg': 0.022911111111111125,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008477777777777753,
      }, {
        'name': '14678',
        'avg': 0.04726666666666669,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.012600000000000033,
      }, {
        'name': '14678',
        'avg': 0.011344444444444463,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.10153333333333338,
      }, {
        'name': '14678',
        'avg': -0.06716666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05284444444444444,
      }, {
        'name': '14678',
        'avg': -0.06947777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.10622222222222223,
      }, {
        'name': '14678',
        'avg': -0.035733333333333325,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.21551111111111113,
      }, {
        'name': '14678',
        'avg': -0.08843333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.10896666666666667,
      }, {
        'name': '14678',
        'avg': -0.10944444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.25285555555555556,
      }, {
        'name': '14678',
        'avg': -0.16031111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.19035555555555553,
      }, {
        'name': '14678',
        'avg': -0.15395555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.2466222222222222,
      }, {
        'name': '14678',
        'avg': -0.09946666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.24216666666666664,
      }, {
        'name': '14678',
        'avg': -0.08393333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.29337777777777774,
      }, {
        'name': '14678',
        'avg': -0.09675555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.3287666666666666,
      }, {
        'name': '14678',
        'avg': -0.13906666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.2223333333333333,
      }, {
        'name': '14678',
        'avg': -0.12868888888888885,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.2112444444444444,
      }, {
        'name': '14678',
        'avg': -0.10125555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.14268888888888884,
      }, {
        'name': '14678',
        'avg': -0.09518888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.18105555555555553,
      }, {
        'name': '14678',
        'avg': -0.07115555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1523666666666666,
      }, {
        'name': '14678',
        'avg': -0.10748888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.170711111111111,
      }, {
        'name': '14678',
        'avg': -0.06683333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.21909999999999993,
      }, {
        'name': '14678',
        'avg': -0.09224444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.1895555555555555,
      }, {
        'name': '14678',
        'avg': -0.12871111111111105,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.20462222222222215,
      }, {
        'name': '14678',
        'avg': -0.08937777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.12888888888888878,
      }, {
        'name': '14678',
        'avg': -0.09706666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.13901111111111097,
      }, {
        'name': '14678',
        'avg': -0.038633333333333304,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.10361111111111104,
      }, {
        'name': '14678',
        'avg': -0.05348888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.09214444444444439,
      }, {
        'name': '14678',
        'avg': -0.04549999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05372222222222213,
      }, {
        'name': '14678',
        'avg': -0.052866666666666624,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06861111111111103,
      }, {
        'name': '14678',
        'avg': -0.02304444444444441,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05476666666666657,
      }, {
        'name': '14678',
        'avg': -0.025899999999999965,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.032022222222222105,
      }, {
        'name': '14678',
        'avg': 0.0037666666666667107,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05355555555555541,
      }, {
        'name': '14678',
        'avg': 0.02573333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.09778888888888876,
      }, {
        'name': '14678',
        'avg': 0.02573333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06879999999999992,
      }, {
        'name': '14678',
        'avg': -0.005466666666666647,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.0681777777777777,
      }, {
        'name': '14678',
        'avg': 0.021633333333333355,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.055944444444444325,
      }, {
        'name': '14678',
        'avg': 0.014344444444444477,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.04913333333333328,
      }, {
        'name': '14678',
        'avg': 0.021611111111111133,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.05503333333333326,
      }, {
        'name': '14678',
        'avg': 0.038577777777777815,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.03344444444444439,
      }, {
        'name': '14678',
        'avg': 0.021500000000000016,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.029099999999999935,
      }, {
        'name': '14678',
        'avg': -0.00033333333333331267,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01857777777777772,
      }, {
        'name': '14678',
        'avg': -0.0027111111111111016,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.031288888888888824,
      }, {
        'name': '14678',
        'avg': 0.014155555555555565,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.023999999999999938,
      }, {
        'name': '14678',
        'avg': 0.004611111111111121,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.02476666666666656,
      }, {
        'name': '14678',
        'avg': 0.02124444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.047366666666666606,
      }, {
        'name': '14678',
        'avg': 0.023533333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.06679999999999994,
      }, {
        'name': '14678',
        'avg': 0.016688888888888923,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.04757777777777769,
      }, {
        'name': '14678',
        'avg': 0.007388888888888924,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.04648888888888882,
      }, {
        'name': '14678',
        'avg': 0.026111111111111127,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.020799999999999944,
      }, {
        'name': '14678',
        'avg': 0.04712222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.02459999999999991,
      }, {
        'name': '14678',
        'avg': 0.046733333333333356,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01002222222222215,
      }, {
        'name': '14678',
        'avg': 0.05165555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01554444444444436,
      }, {
        'name': '14678',
        'avg': 0.06280000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.01837777777777772,
      }, {
        'name': '14678',
        'avg': 0.05842222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.012122222222222106,
      }, {
        'name': '14678',
        'avg': 0.046522222222222236,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.007533333333333387,
      }, {
        'name': '14678',
        'avg': 0.04193333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.0025666666666665384,
      }, {
        'name': '14678',
        'avg': 0.05522222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.004455555555555642,
      }, {
        'name': '14678',
        'avg': 0.05292222222222226,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0065444444444445575,
      }, {
        'name': '14678',
        'avg': 0.048322222222222204,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.006366666666666746,
      }, {
        'name': '14678',
        'avg': 0.037099999999999994,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.017244444444444493,
      }, {
        'name': '14678',
        'avg': 0.025688888888888952,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0164444444444445,
      }, {
        'name': '14678',
        'avg': 0.04134444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.045244444444444545,
      }, {
        'name': '14678',
        'avg': 0.028088888888888868,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.057355555555555604,
      }, {
        'name': '14678',
        'avg': 0.04153333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05873333333333341,
      }, {
        'name': '14678',
        'avg': 0.03921111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07031111111111117,
      }, {
        'name': '14678',
        'avg': 0.04397777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.006344444444444392,
      }, {
        'name': '14678',
        'avg': 0.0597777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.009133333333333422,
      }, {
        'name': '14678',
        'avg': 0.008500000000000006,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.014888888888888951,
      }, {
        'name': '14678',
        'avg': 0.026855555555555563,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05563333333333339,
      }, {
        'name': '14678',
        'avg': 0.038288888888888914,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04357777777777782,
      }, {
        'name': '14678',
        'avg': 0.0724777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.027588888888888975,
      }, {
        'name': '14678',
        'avg': 0.060455555555555575,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.008811111111111198,
      }, {
        'name': '14678',
        'avg': 0.06661111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.01233333333333342,
      }, {
        'name': '14678',
        'avg': 0.04440000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02312222222222232,
      }, {
        'name': '14678',
        'avg': 0.04203333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.013755555555555523,
      }, {
        'name': '14678',
        'avg': 0.03995555555555559,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.0034555555555554687,
      }, {
        'name': '14678',
        'avg': 0.01565555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.037555555555555474,
      }, {
        'name': '14678',
        'avg': 0.037966666666666725,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.019422222222222178,
      }, {
        'name': '14678',
        'avg': 0.029211111111111146,
      },
    ],
    [
      {
        'name': '666',
        'avg': -0.004344444444444373,
      }, {
        'name': '14678',
        'avg': 0.038077777777777835,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.004477777777777867,
      }, {
        'name': '14678',
        'avg': 0.03811111111111117,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.00428888888888894,
      }, {
        'name': '14678',
        'avg': 0.040211111111111135,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.026177777777777887,
      }, {
        'name': '14678',
        'avg': 0.03129999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02584444444444455,
      }, {
        'name': '14678',
        'avg': 0.0489,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07177777777777786,
      }, {
        'name': '14678',
        'avg': 0.06021111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09915555555555561,
      }, {
        'name': '14678',
        'avg': 0.08987777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11498888888888895,
      }, {
        'name': '14678',
        'avg': 0.11326666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15365555555555563,
      }, {
        'name': '14678',
        'avg': 0.11742222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17771111111111118,
      }, {
        'name': '14678',
        'avg': 0.15383333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13664444444444457,
      }, {
        'name': '14678',
        'avg': 0.1597888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.164088888888889,
      }, {
        'name': '14678',
        'avg': 0.12831111111111115,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1203666666666668,
      }, {
        'name': '14678',
        'avg': 0.14302222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.16740000000000005,
      }, {
        'name': '14678',
        'avg': 0.13040000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1882111111111112,
      }, {
        'name': '14678',
        'avg': 0.1634666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.27901111111111127,
      }, {
        'name': '14678',
        'avg': 0.22954444444444452,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.21043333333333344,
      }, {
        'name': '14678',
        'avg': 0.23547777777777792,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.25785555555555567,
      }, {
        'name': '14678',
        'avg': 0.18903333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3717555555555556,
      }, {
        'name': '14678',
        'avg': 0.21939999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.2613777777777779,
      }, {
        'name': '14678',
        'avg': 0.24908888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.4083444444444447,
      }, {
        'name': '14678',
        'avg': 0.29134444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3375666666666667,
      }, {
        'name': '14678',
        'avg': 0.2801222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.40367777777777797,
      }, {
        'name': '14678',
        'avg': 0.226388888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.4064222222222224,
      }, {
        'name': '14678',
        'avg': 0.2310111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.4586111111111111,
      }, {
        'name': '14678',
        'avg': 0.24108888888888896,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.4983,
      }, {
        'name': '14678',
        'avg': 0.27882222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.401188888888889,
      }, {
        'name': '14678',
        'avg': 0.269,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3890666666666668,
      }, {
        'name': '14678',
        'avg': 0.25237777777777787,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.32276666666666676,
      }, {
        'name': '14678',
        'avg': 0.2389888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3513444444444445,
      }, {
        'name': '14678',
        'avg': 0.2082555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3296555555555557,
      }, {
        'name': '14678',
        'avg': 0.24486666666666662,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.34516666666666673,
      }, {
        'name': '14678',
        'avg': 0.21012222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.39402222222222233,
      }, {
        'name': '14678',
        'avg': 0.22643333333333338,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.37166666666666676,
      }, {
        'name': '14678',
        'avg': 0.25835555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3910444444444445,
      }, {
        'name': '14678',
        'avg': 0.23076666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.3080111111111113,
      }, {
        'name': '14678',
        'avg': 0.2338888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.31330000000000013,
      }, {
        'name': '14678',
        'avg': 0.1751888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.27927777777777785,
      }, {
        'name': '14678',
        'avg': 0.18736666666666663,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.26717777777777785,
      }, {
        'name': '14678',
        'avg': 0.18926666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.24157777777777778,
      }, {
        'name': '14678',
        'avg': 0.1900444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.28313333333333335,
      }, {
        'name': '14678',
        'avg': 0.17553333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.23763333333333334,
      }, {
        'name': '14678',
        'avg': 0.21781111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.19883333333333333,
      }, {
        'name': '14678',
        'avg': 0.16264444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1878555555555556,
      }, {
        'name': '14678',
        'avg': 0.14947777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.24432222222222227,
      }, {
        'name': '14678',
        'avg': 0.1473666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1993111111111112,
      }, {
        'name': '14678',
        'avg': 0.1912444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.2005,
      }, {
        'name': '14678',
        'avg': 0.1711111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.19083333333333338,
      }, {
        'name': '14678',
        'avg': 0.17804444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1693555555555556,
      }, {
        'name': '14678',
        'avg': 0.16381111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.16583333333333344,
      }, {
        'name': '14678',
        'avg': 0.1485777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12387777777777777,
      }, {
        'name': '14678',
        'avg': 0.1407444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10630000000000002,
      }, {
        'name': '14678',
        'avg': 0.13916666666666672,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1079444444444445,
      }, {
        'name': '14678',
        'avg': 0.13461111111111118,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08934444444444443,
      }, {
        'name': '14678',
        'avg': 0.14563333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07988888888888893,
      }, {
        'name': '14678',
        'avg': 0.12023333333333339,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09744444444444451,
      }, {
        'name': '14678',
        'avg': 0.09393333333333338,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11492222222222225,
      }, {
        'name': '14678',
        'avg': 0.11490000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14348888888888897,
      }, {
        'name': '14678',
        'avg': 0.12431111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13656666666666673,
      }, {
        'name': '14678',
        'avg': 0.14405555555555563,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12156666666666667,
      }, {
        'name': '14678',
        'avg': 0.13315555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10654444444444451,
      }, {
        'name': '14678',
        'avg': 0.10382222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10264444444444448,
      }, {
        'name': '14678',
        'avg': 0.10494444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10348888888888903,
      }, {
        'name': '14678',
        'avg': 0.10552222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12102222222222228,
      }, {
        'name': '14678',
        'avg': 0.09768888888888891,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12817777777777783,
      }, {
        'name': '14678',
        'avg': 0.10855555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13276666666666673,
      }, {
        'name': '14678',
        'avg': 0.11247777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10927777777777785,
      }, {
        'name': '14678',
        'avg': 0.12496666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10426666666666674,
      }, {
        'name': '14678',
        'avg': 0.11048888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09722222222222228,
      }, {
        'name': '14678',
        'avg': 0.09639999999999996,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09320000000000006,
      }, {
        'name': '14678',
        'avg': 0.10251111111111108,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0659333333333334,
      }, {
        'name': '14678',
        'avg': 0.10307777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05602222222222224,
      }, {
        'name': '14678',
        'avg': 0.0949222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05732222222222224,
      }, {
        'name': '14678',
        'avg': 0.07574444444444442,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.034,
      }, {
        'name': '14678',
        'avg': 0.09107777777777773,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.02445555555555555,
      }, {
        'name': '14678',
        'avg': 0.08403333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.012466666666666675,
      }, {
        'name': '14678',
        'avg': 0.08182222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.015000000000000036,
      }, {
        'name': '14678',
        'avg': 0.07637777777777774,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04127777777777781,
      }, {
        'name': '14678',
        'avg': 0.06954444444444442,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04004444444444452,
      }, {
        'name': '14678',
        'avg': 0.08026666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.017333333333333437,
      }, {
        'name': '14678',
        'avg': 0.07521111111111108,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.009955555555555549,
      }, {
        'name': '14678',
        'avg': 0.05983333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03373333333333336,
      }, {
        'name': '14678',
        'avg': 0.04151111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05757777777777779,
      }, {
        'name': '14678',
        'avg': 0.045577777777777745,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0854777777777778,
      }, {
        'name': '14678',
        'avg': 0.05768888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07793333333333334,
      }, {
        'name': '14678',
        'avg': 0.07682222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08614444444444444,
      }, {
        'name': '14678',
        'avg': 0.08476666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11332222222222228,
      }, {
        'name': '14678',
        'avg': 0.07912222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1096444444444445,
      }, {
        'name': '14678',
        'avg': 0.09463333333333326,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12547777777777785,
      }, {
        'name': '14678',
        'avg': 0.09958888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12427777777777786,
      }, {
        'name': '14678',
        'avg': 0.10048888888888884,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12010000000000005,
      }, {
        'name': '14678',
        'avg': 0.09956666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10920000000000003,
      }, {
        'name': '14678',
        'avg': 0.10176666666666662,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09131111111111109,
      }, {
        'name': '14678',
        'avg': 0.0909222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07805555555555557,
      }, {
        'name': '14678',
        'avg': 0.07675555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08253333333333332,
      }, {
        'name': '14678',
        'avg': 0.07446666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08009999999999998,
      }, {
        'name': '14678',
        'avg': 0.0665222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10432222222222223,
      }, {
        'name': '14678',
        'avg': 0.07086666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09093333333333334,
      }, {
        'name': '14678',
        'avg': 0.08327777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10400000000000001,
      }, {
        'name': '14678',
        'avg': 0.0808222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08398888888888888,
      }, {
        'name': '14678',
        'avg': 0.08733333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08642222222222222,
      }, {
        'name': '14678',
        'avg': 0.07845555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0922,
      }, {
        'name': '14678',
        'avg': 0.07158888888888891,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08834444444444442,
      }, {
        'name': '14678',
        'avg': 0.06776666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08882222222222226,
      }, {
        'name': '14678',
        'avg': 0.06347777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08480000000000003,
      }, {
        'name': '14678',
        'avg': 0.08581111111111113,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08151111111111112,
      }, {
        'name': '14678',
        'avg': 0.07783333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08636666666666666,
      }, {
        'name': '14678',
        'avg': 0.06126666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09181111111111111,
      }, {
        'name': '14678',
        'avg': 0.08408888888888892,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08218888888888888,
      }, {
        'name': '14678',
        'avg': 0.10509999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08453333333333334,
      }, {
        'name': '14678',
        'avg': 0.08046666666666667,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0850777777777778,
      }, {
        'name': '14678',
        'avg': 0.09312222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09121111111111115,
      }, {
        'name': '14678',
        'avg': 0.08505555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08908888888888887,
      }, {
        'name': '14678',
        'avg': 0.09765555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0772111111111111,
      }, {
        'name': '14678',
        'avg': 0.09854444444444446,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06885555555555557,
      }, {
        'name': '14678',
        'avg': 0.11032222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05941111111111111,
      }, {
        'name': '14678',
        'avg': 0.10263333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05310000000000001,
      }, {
        'name': '14678',
        'avg': 0.10694444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.056333333333333346,
      }, {
        'name': '14678',
        'avg': 0.07827777777777781,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05081111111111111,
      }, {
        'name': '14678',
        'avg': 0.1024777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06115555555555556,
      }, {
        'name': '14678',
        'avg': 0.0968888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.052755555555555556,
      }, {
        'name': '14678',
        'avg': 0.09305555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03864444444444447,
      }, {
        'name': '14678',
        'avg': 0.0903,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04670000000000001,
      }, {
        'name': '14678',
        'avg': 0.08264444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05003333333333333,
      }, {
        'name': '14678',
        'avg': 0.0827777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06397777777777777,
      }, {
        'name': '14678',
        'avg': 0.07661111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07496666666666668,
      }, {
        'name': '14678',
        'avg': 0.08885555555555558,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0641777777777778,
      }, {
        'name': '14678',
        'avg': 0.10272222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.060822222222222236,
      }, {
        'name': '14678',
        'avg': 0.08084444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05935555555555557,
      }, {
        'name': '14678',
        'avg': 0.04767777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04682222222222222,
      }, {
        'name': '14678',
        'avg': 0.057999999999999975,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.021755555555555566,
      }, {
        'name': '14678',
        'avg': 0.03729999999999997,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06983333333333333,
      }, {
        'name': '14678',
        'avg': 0.008122222222222227,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09435555555555557,
      }, {
        'name': '14678',
        'avg': 0.044944444444444426,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12555555555555556,
      }, {
        'name': '14678',
        'avg': 0.044666666666666625,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09982222222222223,
      }, {
        'name': '14678',
        'avg': 0.048799999999999975,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1233777777777778,
      }, {
        'name': '14678',
        'avg': 0.03208888888888886,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12113333333333334,
      }, {
        'name': '14678',
        'avg': 0.03606666666666663,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08680000000000002,
      }, {
        'name': '14678',
        'avg': 0.02794444444444441,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10277777777777777,
      }, {
        'name': '14678',
        'avg': 0.015855555555555526,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09066666666666663,
      }, {
        'name': '14678',
        'avg': 0.026277777777777754,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12092222222222221,
      }, {
        'name': '14678',
        'avg': 0.02454444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14922222222222223,
      }, {
        'name': '14678',
        'avg': 0.0517,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13865555555555556,
      }, {
        'name': '14678',
        'avg': 0.07626666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17706666666666668,
      }, {
        'name': '14678',
        'avg': 0.04437777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17807777777777778,
      }, {
        'name': '14678',
        'avg': 0.07943333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.16854444444444447,
      }, {
        'name': '14678',
        'avg': 0.08523333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17265555555555556,
      }, {
        'name': '14678',
        'avg': 0.06161111111111109,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1631,
      }, {
        'name': '14678',
        'avg': 0.061733333333333286,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15906666666666666,
      }, {
        'name': '14678',
        'avg': 0.055233333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17493333333333336,
      }, {
        'name': '14678',
        'avg': 0.06929999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15432222222222222,
      }, {
        'name': '14678',
        'avg': 0.0776222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1695111111111111,
      }, {
        'name': '14678',
        'avg': 0.06893333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14525555555555555,
      }, {
        'name': '14678',
        'avg': 0.0635222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13429999999999997,
      }, {
        'name': '14678',
        'avg': 0.051144444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11594444444444445,
      }, {
        'name': '14678',
        'avg': 0.029344444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09910000000000001,
      }, {
        'name': '14678',
        'avg': 0.009199999999999991,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11872222222222223,
      }, {
        'name': '14678',
        'avg': -0.007088888888888884,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09887777777777777,
      }, {
        'name': '14678',
        'avg': -0.0050444444444444425,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09530000000000002,
      }, {
        'name': '14678',
        'avg': 0.0009888888888888872,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12158888888888889,
      }, {
        'name': '14678',
        'avg': -0.009177777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1307555555555555,
      }, {
        'name': '14678',
        'avg': 0.02335555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11097777777777777,
      }, {
        'name': '14678',
        'avg': 0.021577777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09851111111111109,
      }, {
        'name': '14678',
        'avg': 0.009777777777777774,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11437777777777776,
      }, {
        'name': '14678',
        'avg': -0.0004888888888888955,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10458888888888886,
      }, {
        'name': '14678',
        'avg': 0.007744444444444439,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.14096666666666663,
      }, {
        'name': '14678',
        'avg': -0.004488888888888894,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.15103333333333327,
      }, {
        'name': '14678',
        'avg': 0.03261111111111108,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.20180000000000006,
      }, {
        'name': '14678',
        'avg': 0.02849999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.18965555555555558,
      }, {
        'name': '14678',
        'avg': 0.07807777777777779,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.21034444444444453,
      }, {
        'name': '14678',
        'avg': 0.06963333333333335,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.19491111111111117,
      }, {
        'name': '14678',
        'avg': 0.08816666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.17833333333333334,
      }, {
        'name': '14678',
        'avg': 0.08187777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13743333333333332,
      }, {
        'name': '14678',
        'avg': 0.06520000000000001,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11514444444444447,
      }, {
        'name': '14678',
        'avg': 0.021488888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12327777777777779,
      }, {
        'name': '14678',
        'avg': 0.013211111111111099,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10179999999999999,
      }, {
        'name': '14678',
        'avg': 0.015033333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09727777777777777,
      }, {
        'name': '14678',
        'avg': 0.027222222222222203,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09459999999999999,
      }, {
        'name': '14678',
        'avg': 0.021299999999999993,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12416666666666663,
      }, {
        'name': '14678',
        'avg': -0.003299999999999993,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10807777777777779,
      }, {
        'name': '14678',
        'avg': 0.02293333333333333,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09162222222222223,
      }, {
        'name': '14678',
        'avg': 0.01871111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10096666666666666,
      }, {
        'name': '14678',
        'avg': 0.014755555555555563,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12695555555555554,
      }, {
        'name': '14678',
        'avg': 0.020744444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12148888888888888,
      }, {
        'name': '14678',
        'avg': 0.05269999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.13067777777777775,
      }, {
        'name': '14678',
        'avg': 0.05647777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12910000000000002,
      }, {
        'name': '14678',
        'avg': 0.07456666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11972222222222224,
      }, {
        'name': '14678',
        'avg': 0.08996666666666664,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12125555555555556,
      }, {
        'name': '14678',
        'avg': 0.07755555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12224444444444447,
      }, {
        'name': '14678',
        'avg': 0.07726666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12281111111111111,
      }, {
        'name': '14678',
        'avg': 0.08483333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10438888888888892,
      }, {
        'name': '14678',
        'avg': 0.0828,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09484444444444448,
      }, {
        'name': '14678',
        'avg': 0.06354444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10587777777777782,
      }, {
        'name': '14678',
        'avg': 0.07544444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08582222222222222,
      }, {
        'name': '14678',
        'avg': 0.09061111111111109,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10012222222222225,
      }, {
        'name': '14678',
        'avg': 0.0624,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09900000000000005,
      }, {
        'name': '14678',
        'avg': 0.07788888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10760000000000006,
      }, {
        'name': '14678',
        'avg': 0.08592222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10808888888888894,
      }, {
        'name': '14678',
        'avg': 0.0758,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11700000000000003,
      }, {
        'name': '14678',
        'avg': 0.06232222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11385555555555563,
      }, {
        'name': '14678',
        'avg': 0.0839111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0920777777777778,
      }, {
        'name': '14678',
        'avg': 0.07426666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09088888888888892,
      }, {
        'name': '14678',
        'avg': 0.06919999999999998,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09356666666666667,
      }, {
        'name': '14678',
        'avg': 0.05931111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10565555555555556,
      }, {
        'name': '14678',
        'avg': 0.052677777777777754,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09840000000000004,
      }, {
        'name': '14678',
        'avg': 0.031188888888888894,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09106666666666673,
      }, {
        'name': '14678',
        'avg': 0.023899999999999977,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06640000000000007,
      }, {
        'name': '14678',
        'avg': 0.023899999999999977,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07598888888888891,
      }, {
        'name': '14678',
        'avg': 0.03208888888888888,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0950444444444445,
      }, {
        'name': '14678',
        'avg': 0.019588888888888854,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09074444444444446,
      }, {
        'name': '14678',
        'avg': 0.04103333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07412222222222223,
      }, {
        'name': '14678',
        'avg': 0.037466666666666655,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0872444444444445,
      }, {
        'name': '14678',
        'avg': 0.025599999999999977,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09110000000000004,
      }, {
        'name': '14678',
        'avg': 0.04332222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08388888888888887,
      }, {
        'name': '14678',
        'avg': 0.05302222222222221,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07839999999999998,
      }, {
        'name': '14678',
        'avg': 0.06467777777777775,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0699333333333333,
      }, {
        'name': '14678',
        'avg': 0.06405555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07929999999999995,
      }, {
        'name': '14678',
        'avg': 0.04992222222222219,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0801333333333333,
      }, {
        'name': '14678',
        'avg': 0.07153333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07845555555555551,
      }, {
        'name': '14678',
        'avg': 0.0801111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08207777777777774,
      }, {
        'name': '14678',
        'avg': 0.07965555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09167777777777775,
      }, {
        'name': '14678',
        'avg': 0.0879111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07859999999999993,
      }, {
        'name': '14678',
        'avg': 0.08822222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0729222222222222,
      }, {
        'name': '14678',
        'avg': 0.08603333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07167777777777776,
      }, {
        'name': '14678',
        'avg': 0.08935555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07522222222222218,
      }, {
        'name': '14678',
        'avg': 0.08919999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06917777777777775,
      }, {
        'name': '14678',
        'avg': 0.09323333333333331,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07599999999999996,
      }, {
        'name': '14678',
        'avg': 0.09275555555555552,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10670000000000002,
      }, {
        'name': '14678',
        'avg': 0.10435555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09787777777777773,
      }, {
        'name': '14678',
        'avg': 0.12405555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11710000000000012,
      }, {
        'name': '14678',
        'avg': 0.13323333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09877777777777773,
      }, {
        'name': '14678',
        'avg': 0.14394444444444449,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06875555555555551,
      }, {
        'name': '14678',
        'avg': 0.13962222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08318888888888885,
      }, {
        'name': '14678',
        'avg': 0.10819999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0768222222222222,
      }, {
        'name': '14678',
        'avg': 0.12127777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07128888888888889,
      }, {
        'name': '14678',
        'avg': 0.10564444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06952222222222224,
      }, {
        'name': '14678',
        'avg': 0.1013222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07445555555555557,
      }, {
        'name': '14678',
        'avg': 0.10475555555555552,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07742222222222223,
      }, {
        'name': '14678',
        'avg': 0.11209999999999999,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07588888888888891,
      }, {
        'name': '14678',
        'avg': 0.11707777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07213333333333335,
      }, {
        'name': '14678',
        'avg': 0.1092222222222222,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07856666666666669,
      }, {
        'name': '14678',
        'avg': 0.11098888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08725555555555559,
      }, {
        'name': '14678',
        'avg': 0.11593333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08992222222222224,
      }, {
        'name': '14678',
        'avg': 0.12932222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09571111111111112,
      }, {
        'name': '14678',
        'avg': 0.13477777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09478888888888888,
      }, {
        'name': '14678',
        'avg': 0.15943333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10592222222222224,
      }, {
        'name': '14678',
        'avg': 0.16645555555555552,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09714444444444449,
      }, {
        'name': '14678',
        'avg': 0.176,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12043333333333334,
      }, {
        'name': '14678',
        'avg': 0.16584444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12699999999999997,
      }, {
        'name': '14678',
        'avg': 0.17215555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09694444444444446,
      }, {
        'name': '14678',
        'avg': 0.17970000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09754444444444445,
      }, {
        'name': '14678',
        'avg': 0.15497777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09446666666666662,
      }, {
        'name': '14678',
        'avg': 0.16837777777777777,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.1262222222222222,
      }, {
        'name': '14678',
        'avg': 0.1904444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11367777777777775,
      }, {
        'name': '14678',
        'avg': 0.20902222222222228,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.12187777777777777,
      }, {
        'name': '14678',
        'avg': 0.18807777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11743333333333335,
      }, {
        'name': '14678',
        'avg': 0.21241111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11335555555555557,
      }, {
        'name': '14678',
        'avg': 0.20205555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09657777777777782,
      }, {
        'name': '14678',
        'avg': 0.20238888888888884,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09524444444444448,
      }, {
        'name': '14678',
        'avg': 0.17735555555555554,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09270000000000002,
      }, {
        'name': '14678',
        'avg': 0.17594444444444443,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08843333333333334,
      }, {
        'name': '14678',
        'avg': 0.16253333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0831777777777778,
      }, {
        'name': '14678',
        'avg': 0.1627888888888889,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10870000000000002,
      }, {
        'name': '14678',
        'avg': 0.16358888888888887,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10422222222222227,
      }, {
        'name': '14678',
        'avg': 0.1827444444444444,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10307777777777781,
      }, {
        'name': '14678',
        'avg': 0.18618888888888882,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11342222222222224,
      }, {
        'name': '14678',
        'avg': 0.17547777777777776,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11845555555555554,
      }, {
        'name': '14678',
        'avg': 0.17376666666666665,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.11373333333333337,
      }, {
        'name': '14678',
        'avg': 0.18003333333333332,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.098,
      }, {
        'name': '14678',
        'avg': 0.18405555555555553,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10075555555555557,
      }, {
        'name': '14678',
        'avg': 0.17477777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10716666666666666,
      }, {
        'name': '14678',
        'avg': 0.16711111111111107,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09531111111111112,
      }, {
        'name': '14678',
        'avg': 0.18131111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0702222222222222,
      }, {
        'name': '14678',
        'avg': 0.17396666666666666,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07269999999999997,
      }, {
        'name': '14678',
        'avg': 0.14600000000000002,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08009999999999998,
      }, {
        'name': '14678',
        'avg': 0.15215555555555557,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08488888888888886,
      }, {
        'name': '14678',
        'avg': 0.15142222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07796666666666666,
      }, {
        'name': '14678',
        'avg': 0.13433333333333336,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08065555555555555,
      }, {
        'name': '14678',
        'avg': 0.13264444444444448,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07051111111111111,
      }, {
        'name': '14678',
        'avg': 0.1271555555555556,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08486666666666666,
      }, {
        'name': '14678',
        'avg': 0.11620000000000004,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08926666666666667,
      }, {
        'name': '14678',
        'avg': 0.12808888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09716666666666664,
      }, {
        'name': '14678',
        'avg': 0.14292222222222223,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08997777777777777,
      }, {
        'name': '14678',
        'avg': 0.14080000000000004,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.09983333333333329,
      }, {
        'name': '14678',
        'avg': 0.12061111111111116,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0839111111111111,
      }, {
        'name': '14678',
        'avg': 0.12772222222222226,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08046666666666667,
      }, {
        'name': '14678',
        'avg': 0.12021111111111119,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07557777777777777,
      }, {
        'name': '14678',
        'avg': 0.11518888888888895,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06794444444444443,
      }, {
        'name': '14678',
        'avg': 0.10676666666666673,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06296666666666664,
      }, {
        'name': '14678',
        'avg': 0.11422222222222228,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06456666666666666,
      }, {
        'name': '14678',
        'avg': 0.09332222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08139999999999999,
      }, {
        'name': '14678',
        'avg': 0.10407777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07889999999999998,
      }, {
        'name': '14678',
        'avg': 0.11892222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.059699999999999975,
      }, {
        'name': '14678',
        'avg': 0.12272222222222225,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03264444444444441,
      }, {
        'name': '14678',
        'avg': 0.1046444444444445,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04334444444444442,
      }, {
        'name': '14678',
        'avg': 0.10703333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06355555555555556,
      }, {
        'name': '14678',
        'avg': 0.13107777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.10086666666666667,
      }, {
        'name': '14678',
        'avg': 0.13280000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08896666666666662,
      }, {
        'name': '14678',
        'avg': 0.14762222222222224,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0693,
      }, {
        'name': '14678',
        'avg': 0.13250000000000003,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.049488888888888895,
      }, {
        'name': '14678',
        'avg': 0.11234444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.060699999999999935,
      }, {
        'name': '14678',
        'avg': 0.10806666666666671,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05073333333333329,
      }, {
        'name': '14678',
        'avg': 0.11716666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05177777777777776,
      }, {
        'name': '14678',
        'avg': 0.09221111111111115,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.038211111111111085,
      }, {
        'name': '14678',
        'avg': 0.0916111111111111,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03888888888888886,
      }, {
        'name': '14678',
        'avg': 0.06461111111111112,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04581111111111107,
      }, {
        'name': '14678',
        'avg': 0.06051111111111115,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.05294444444444442,
      }, {
        'name': '14678',
        'avg': 0.06755555555555559,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.04952222222222219,
      }, {
        'name': '14678',
        'avg': 0.06744444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0410333333333333,
      }, {
        'name': '14678',
        'avg': 0.0678777777777778,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.03888888888888887,
      }, {
        'name': '14678',
        'avg': 0.058666666666666686,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.0406333333333333,
      }, {
        'name': '14678',
        'avg': 0.06054444444444447,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06362222222222219,
      }, {
        'name': '14678',
        'avg': 0.06965555555555555,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06211111111111108,
      }, {
        'name': '14678',
        'avg': 0.07841111111111114,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.06675555555555553,
      }, {
        'name': '14678',
        'avg': 0.07427777777777782,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07476666666666663,
      }, {
        'name': '14678',
        'avg': 0.07066666666666668,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.08085555555555551,
      }, {
        'name': '14678',
        'avg': 0.07943333333333334,
      },
    ],
    [
      {
        'name': '666',
        'avg': 0.07902222222222219,
      }, {
        'name': '14678',
        'avg': 0.06688888888888891,
      },
    ],
  ],
  'min_date': 1516579200,
  'max_date': 1634860800,
  'dates': [
    1516579200,
    1516665600,
    1516752000,
    1516838400,
    1516924800,
    1517184000,
    1517270400,
    1517356800,
    1517443200,
    1517529600,
    1517788800,
    1517875200,
    1517961600,
    1518048000,
    1518134400,
    1518393600,
    1518480000,
    1518566400,
    1518652800,
    1518739200,
    1519084800,
    1519171200,
    1519257600,
    1519344000,
    1519603200,
    1519689600,
    1519776000,
    1519862400,
    1519948800,
    1520208000,
    1520294400,
    1520380800,
    1520467200,
    1520553600,
    1520985600,
    1521072000,
    1521158400,
    1521417600,
    1521504000,
    1521590400,
    1521676800,
    1521763200,
    1522022400,
    1522108800,
    1522195200,
    1522281600,
    1522713600,
    1522800000,
    1522886400,
    1522972800,
    1523318400,
    1523404800,
    1523491200,
    1523577600,
    1523836800,
    1523923200,
    1524009600,
    1524096000,
    1524182400,
    1524441600,
    1524528000,
    1524614400,
    1524700800,
    1524787200,
    1525046400,
    1525132800,
    1525219200,
    1525305600,
    1525392000,
    1525737600,
    1525824000,
    1525910400,
    1525996800,
    1526256000,
    1526342400,
    1526428800,
    1526515200,
    1526601600,
    1526860800,
    1526947200,
    1527033600,
    1527120000,
    1527206400,
    1527552000,
    1527638400,
    1527724800,
    1527811200,
    1528070400,
    1528156800,
    1528243200,
    1528329600,
    1528416000,
    1528675200,
    1528761600,
    1528848000,
    1528934400,
    1529020800,
    1529280000,
    1529366400,
    1529452800,
    1529539200,
    1529625600,
    1529884800,
    1529971200,
    1530057600,
    1530144000,
    1530230400,
    1530489600,
    1530576000,
    1530748800,
    1530835200,
    1531094400,
    1531180800,
    1531267200,
    1531353600,
    1531440000,
    1531699200,
    1531785600,
    1531872000,
    1531958400,
    1532044800,
    1532304000,
    1532390400,
    1532476800,
    1532563200,
    1532649600,
    1532908800,
    1532995200,
    1533081600,
    1533168000,
    1533254400,
    1533513600,
    1533600000,
    1533686400,
    1533772800,
    1533859200,
    1534118400,
    1534204800,
    1534291200,
    1534377600,
    1534464000,
    1534723200,
    1534809600,
    1534896000,
    1534982400,
    1535068800,
    1535414400,
    1535500800,
    1535587200,
    1535673600,
    1536019200,
    1536105600,
    1536192000,
    1536278400,
    1536537600,
    1536624000,
    1536710400,
    1536796800,
    1536883200,
    1537142400,
    1537228800,
    1537315200,
    1537401600,
    1537488000,
    1537747200,
    1537833600,
    1537920000,
    1538006400,
    1538092800,
    1538352000,
    1538438400,
    1538524800,
    1538611200,
    1538697600,
    1538956800,
    1539043200,
    1539129600,
    1539216000,
    1539302400,
    1539561600,
    1539648000,
    1539734400,
    1539820800,
    1539907200,
    1540166400,
    1540252800,
    1540339200,
    1540425600,
    1540512000,
    1540771200,
    1540857600,
    1540944000,
    1541030400,
    1541116800,
    1541376000,
    1541462400,
    1541548800,
    1541635200,
    1541721600,
    1541980800,
    1542067200,
    1542153600,
    1542240000,
    1542326400,
    1542585600,
    1542672000,
    1542758400,
    1542931200,
    1543190400,
    1543276800,
    1543363200,
    1543449600,
    1543536000,
    1543795200,
    1543881600,
    1544054400,
    1544140800,
    1544400000,
    1544486400,
    1544572800,
    1544659200,
    1544745600,
    1545004800,
    1545091200,
    1545177600,
    1545264000,
    1545350400,
    1545609600,
    1545868800,
    1545955200,
    1546214400,
    1546387200,
    1546473600,
    1546560000,
    1546819200,
    1546905600,
    1546992000,
    1547078400,
    1547164800,
    1547424000,
    1547510400,
    1547596800,
    1547683200,
    1547769600,
    1548115200,
    1548201600,
    1548288000,
    1548374400,
    1548633600,
    1548720000,
    1548806400,
    1548892800,
    1548979200,
    1549238400,
    1549324800,
    1549411200,
    1549497600,
    1549584000,
    1549843200,
    1549929600,
    1550016000,
    1550102400,
    1550188800,
    1550534400,
    1550620800,
    1550707200,
    1550793600,
    1551052800,
    1551139200,
    1551225600,
    1551312000,
    1551398400,
    1551657600,
    1551744000,
    1551830400,
    1551916800,
    1552003200,
    1552262400,
    1552348800,
    1552435200,
    1552521600,
    1552608000,
    1552867200,
    1552953600,
    1553040000,
    1553126400,
    1553212800,
    1553472000,
    1553558400,
    1553644800,
    1553731200,
    1553817600,
    1554076800,
    1554163200,
    1554249600,
    1554336000,
    1554422400,
    1554681600,
    1554768000,
    1554854400,
    1554940800,
    1555027200,
    1555286400,
    1555372800,
    1555459200,
    1555545600,
    1555977600,
    1556064000,
    1556150400,
    1556236800,
    1556496000,
    1556582400,
    1556668800,
    1556755200,
    1556841600,
    1557187200,
    1557273600,
    1557360000,
    1557446400,
    1557705600,
    1557792000,
    1557878400,
    1557964800,
    1558051200,
    1558310400,
    1558396800,
    1558483200,
    1558569600,
    1558656000,
    1559001600,
    1559088000,
    1559174400,
    1559260800,
    1559520000,
    1559606400,
    1559692800,
    1559779200,
    1559865600,
    1560124800,
    1560211200,
    1560297600,
    1560384000,
    1560470400,
    1560729600,
    1560816000,
    1560902400,
    1560988800,
    1561075200,
    1561334400,
    1561420800,
    1561507200,
    1561593600,
    1561680000,
    1561939200,
    1562025600,
    1562112000,
    1562284800,
    1562544000,
    1562630400,
    1562716800,
    1562803200,
    1562889600,
    1563148800,
    1563235200,
    1563321600,
    1563408000,
    1563494400,
    1563753600,
    1563840000,
    1563926400,
    1564012800,
    1564099200,
    1564358400,
    1564444800,
    1564531200,
    1564617600,
    1564704000,
    1564963200,
    1565049600,
    1565136000,
    1565222400,
    1565308800,
    1565568000,
    1565654400,
    1565740800,
    1565827200,
    1565913600,
    1566172800,
    1566259200,
    1566345600,
    1566432000,
    1566518400,
    1566864000,
    1566950400,
    1567036800,
    1567123200,
    1567468800,
    1567555200,
    1567641600,
    1567728000,
    1567987200,
    1568073600,
    1568160000,
    1568246400,
    1568332800,
    1568592000,
    1568678400,
    1568764800,
    1568851200,
    1568937600,
    1569196800,
    1569283200,
    1569369600,
    1569456000,
    1569542400,
    1569801600,
    1569888000,
    1569974400,
    1570060800,
    1570147200,
    1570406400,
    1570492800,
    1570579200,
    1570665600,
    1570752000,
    1571011200,
    1571097600,
    1571184000,
    1571270400,
    1571356800,
    1571616000,
    1571702400,
    1571788800,
    1571875200,
    1571961600,
    1572220800,
    1572307200,
    1572393600,
    1572480000,
    1572566400,
    1572825600,
    1572912000,
    1572998400,
    1573084800,
    1573171200,
    1573430400,
    1573516800,
    1573603200,
    1573689600,
    1573776000,
    1574035200,
    1574121600,
    1574208000,
    1574294400,
    1574380800,
    1574640000,
    1574726400,
    1574812800,
    1574985600,
    1575244800,
    1575331200,
    1575417600,
    1575504000,
    1575590400,
    1575849600,
    1575936000,
    1576022400,
    1576108800,
    1576195200,
    1576454400,
    1576540800,
    1576627200,
    1576713600,
    1576800000,
    1577059200,
    1577145600,
    1577404800,
    1577664000,
    1577750400,
    1577923200,
    1578009600,
    1578268800,
    1578355200,
    1578441600,
    1578528000,
    1578614400,
    1578873600,
    1578960000,
    1579046400,
    1579132800,
    1579219200,
    1579564800,
    1579651200,
    1579737600,
    1579824000,
    1580083200,
    1580169600,
    1580256000,
    1580342400,
    1580428800,
    1580688000,
    1580774400,
    1580860800,
    1580947200,
    1581033600,
    1581292800,
    1581379200,
    1581465600,
    1581552000,
    1581638400,
    1581984000,
    1582070400,
    1582156800,
    1582243200,
    1582502400,
    1582588800,
    1582675200,
    1582761600,
    1582848000,
    1583107200,
    1583193600,
    1583280000,
    1583366400,
    1583452800,
    1583712000,
    1583798400,
    1583884800,
    1583971200,
    1584057600,
    1584316800,
    1584403200,
    1584489600,
    1584576000,
    1584662400,
    1584921600,
    1585008000,
    1585094400,
    1585180800,
    1585267200,
    1585526400,
    1585612800,
    1585699200,
    1585785600,
    1585872000,
    1586131200,
    1586217600,
    1586304000,
    1586390400,
    1586822400,
    1586908800,
    1586995200,
    1587081600,
    1587340800,
    1587427200,
    1587513600,
    1587600000,
    1587686400,
    1587945600,
    1588032000,
    1588118400,
    1588550400,
    1588636800,
    1588723200,
    1588809600,
    1589155200,
    1589241600,
    1589328000,
    1589414400,
    1589500800,
    1589760000,
    1589846400,
    1589932800,
    1590019200,
    1590105600,
    1590451200,
    1590537600,
    1590624000,
    1590710400,
    1590969600,
    1591056000,
    1591142400,
    1591228800,
    1591315200,
    1591574400,
    1591660800,
    1591747200,
    1591833600,
    1591920000,
    1592179200,
    1592265600,
    1592352000,
    1592438400,
    1592524800,
    1592784000,
    1592870400,
    1592956800,
    1593043200,
    1593129600,
    1593388800,
    1593475200,
    1593561600,
    1593648000,
    1593993600,
    1594080000,
    1594166400,
    1594252800,
    1594339200,
    1594598400,
    1594684800,
    1594771200,
    1594857600,
    1594944000,
    1595203200,
    1595289600,
    1595376000,
    1595462400,
    1595548800,
    1595808000,
    1595894400,
    1595980800,
    1596067200,
    1596153600,
    1596412800,
    1596499200,
    1596585600,
    1596672000,
    1596758400,
    1597017600,
    1597104000,
    1597190400,
    1597276800,
    1597363200,
    1597622400,
    1597708800,
    1597795200,
    1597881600,
    1597968000,
    1598313600,
    1598918400,
    1599004800,
    1599091200,
    1599177600,
    1599523200,
    1599609600,
    1599696000,
    1599782400,
    1600128000,
    1600214400,
    1600300800,
    1600387200,
    1600646400,
    1600732800,
    1600819200,
    1600905600,
    1600992000,
    1601337600,
    1601424000,
    1601510400,
    1601596800,
    1601856000,
    1601942400,
    1602028800,
    1602115200,
    1602201600,
    1602460800,
    1602547200,
    1602633600,
    1602720000,
    1602806400,
    1603065600,
    1603152000,
    1603238400,
    1603324800,
    1603411200,
    1603670400,
    1603756800,
    1603843200,
    1603929600,
    1604016000,
    1604275200,
    1604361600,
    1604448000,
    1604534400,
    1604620800,
    1604880000,
    1604966400,
    1605052800,
    1605139200,
    1605225600,
    1605484800,
    1605571200,
    1605657600,
    1605744000,
    1605830400,
    1606089600,
    1606176000,
    1606262400,
    1606435200,
    1606694400,
    1606780800,
    1606867200,
    1606953600,
    1607040000,
    1607299200,
    1607385600,
    1607472000,
    1607558400,
    1607644800,
    1607904000,
    1607990400,
    1608076800,
    1608163200,
    1608249600,
    1608508800,
    1608595200,
    1608681600,
    1608768000,
    1609200000,
    1609286400,
    1609372800,
    1609718400,
    1609804800,
    1609891200,
    1609977600,
    1610064000,
    1610323200,
    1610409600,
    1610496000,
    1610582400,
    1610668800,
    1611014400,
    1611100800,
    1611187200,
    1611273600,
    1611532800,
    1611619200,
    1611705600,
    1611792000,
    1611878400,
    1612137600,
    1612224000,
    1612310400,
    1612396800,
    1612483200,
    1612742400,
    1612828800,
    1612915200,
    1613001600,
    1613088000,
    1613433600,
    1613520000,
    1613606400,
    1613692800,
    1613952000,
    1614038400,
    1614124800,
    1614211200,
    1614297600,
    1614556800,
    1614643200,
    1614729600,
    1614816000,
    1614902400,
    1615161600,
    1615248000,
    1615334400,
    1615420800,
    1615507200,
    1615766400,
    1615852800,
    1615939200,
    1616025600,
    1616112000,
    1616371200,
    1616457600,
    1616544000,
    1616630400,
    1616716800,
    1616976000,
    1617062400,
    1617148800,
    1617235200,
    1617667200,
    1617753600,
    1617840000,
    1617926400,
    1618185600,
    1618272000,
    1618358400,
    1618790400,
    1618876800,
    1618963200,
    1619049600,
    1619136000,
    1619395200,
    1619481600,
    1619568000,
    1619654400,
    1619740800,
    1620086400,
    1620172800,
    1620259200,
    1620345600,
    1620604800,
    1620691200,
    1620777600,
    1620864000,
    1620950400,
    1621209600,
    1621296000,
    1621382400,
    1621468800,
    1621555200,
    1621814400,
    1621900800,
    1621987200,
    1622073600,
    1622160000,
    1622505600,
    1622592000,
    1622678400,
    1622764800,
    1623024000,
    1623110400,
    1623196800,
    1623283200,
    1623369600,
    1623628800,
    1623715200,
    1623888000,
    1623974400,
    1624233600,
    1624320000,
    1624406400,
    1624492800,
    1624579200,
    1624838400,
    1624924800,
    1625011200,
    1625097600,
    1625184000,
    1625529600,
    1625616000,
    1625702400,
    1625788800,
    1626048000,
    1626134400,
    1626220800,
    1626307200,
    1626393600,
    1626652800,
    1626739200,
    1626825600,
    1626912000,
    1626998400,
    1627257600,
    1627344000,
    1627430400,
    1627516800,
    1627603200,
    1627862400,
    1627948800,
    1628035200,
    1628121600,
    1628208000,
    1628467200,
    1628553600,
    1628640000,
    1628812800,
    1629072000,
    1629158400,
    1629244800,
    1629331200,
    1629417600,
    1629676800,
    1629763200,
    1629849600,
    1629936000,
    1630022400,
    1630368000,
    1630454400,
    1630540800,
    1630627200,
    1630972800,
    1631059200,
    1631145600,
    1631232000,
    1631491200,
    1631577600,
    1631664000,
    1631750400,
    1631836800,
    1632096000,
    1632182400,
    1632268800,
    1632355200,
    1632441600,
    1632700800,
    1632787200,
    1632873600,
    1632960000,
    1633046400,
    1633305600,
    1633392000,
    1633478400,
    1633564800,
    1633651200,
    1633910400,
    1633996800,
    1634083200,
    1634169600,
    1634256000,
    1634515200,
    1634601600,
    1634688000,
    1634774400,
    1634860800,
  ],
};

const bootstrapAttributionResponse = {
  'intercept': {
    'name': 'alpha',
    'lower': 0.06677430106368215,
    'upper': 0.07719520261692232,
  },
  'coefficients': [
    {
      'name': '666',
      'lower': 0.008057180129875741,
      'upper': 0.02192814568990405,
    },
  ],
};


const addAssetProcess = async (app, assetName, click) => {
  const dropId = 'portfoliosearch-securitytype-dropdown';

  fireEvent.change(app.getByTestId(dropId), {
    target: {
      value: 'index',
    },
  });
  const securityInput = app.getByPlaceholderText('Search Security');
  userEvent.type(securityInput, 'Random Name');
  await waitFor(() => app.findAllByText('Random Name'));

  await userEvent.click(app.getAllByText(assetName)[0]);
  await userEvent.click(app.getByText(click));
};

describe('Testing the functionality of the main app', () => {
  it('can add dependent', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    await addAssetProcess(app, 'Random Name', 'Add Dependent');

    expect(app.getByText('Random Name')).toBeTruthy();
  });

  it('can add independent', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    await addAssetProcess(app, 'Random Name', 'Add Independent');

    expect(app.getByText('Random Name')).toBeTruthy();
  });

  it('can add multiple assets & security search input will clear', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    const initialValue = app.getByPlaceholderText('Search Security').value;
    expect(initialValue).toBeFalsy();

    await addAssetProcess(app, 'Random Name', 'Add Independent');
    await addAssetProcess(app, 'Random Name', 'Add Independent');

    const searchTextValue = app.getByPlaceholderText('Search Security').value;
    expect(searchTextValue).toBeFalsy();
  });

  it('can run the core model and display the results', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    await addAssetProcess(app, 'Random Name', 'Add Independent');
    await addAssetProcess(app, 'Random Name 1', 'Add Independent');
    await addAssetProcess(app, 'Random Name 2', 'Add Dependent');

    axios.get.mockReturnValue(Promise.resolve(attributionResponse));
    await userEvent.click(app.getByText('Run Core'));
    await waitFor(() => app.getByTestId('riskattribution-modelresults'));
  });

  it('can run the rolling model and display the results', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    await addAssetProcess(app, 'Random Name', 'Add Independent');
    await addAssetProcess(app, 'Random Name 1', 'Add Independent');
    await addAssetProcess(app, 'Random Name 2', 'Add Dependent');

    axios.get.mockReturnValue(Promise.resolve(rollingAttributionResponse));
    await userEvent.click(app.getByText('Run Rolling'));
    await waitFor(() => app.getByTestId('riskattribution-modelresults'));
  });

  it('can run the bootstrap model and display the results', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    await addAssetProcess(app, 'Random Name', 'Add Independent');
    await addAssetProcess(app, 'Random Name 1', 'Add Independent');
    await addAssetProcess(app, 'Random Name 2', 'Add Dependent');

    axios.get.mockReturnValue(Promise.resolve(bootstrapAttributionResponse));
    await userEvent.click(app.getByText('Run Bootstrap'));
    await waitFor(() => app.getByTestId('riskattribution-modelresults'));
  });
});
