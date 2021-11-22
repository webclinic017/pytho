from setuptools import setup
from setuptools_rust import Binding, RustExtension

setup(
    name="backtest",
    version="1.0",
    rust_extensions=[RustExtension("backtest.backtest", binding=Binding.PyO3)],
    packages=["backtest"],
    # rust extensions are not zip safe, just like C-extensions.
    zip_safe=False,
)