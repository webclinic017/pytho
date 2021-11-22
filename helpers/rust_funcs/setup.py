from setuptools import setup
from setuptools_rust import Binding, RustExtension

setup(
    name="rust_funcs",
    version="1.0",
    rust_extensions=[RustExtension("backtest.rust_funcs", binding=Binding.PyO3), RustExtension("other.rust_funcs", binding=Binding.PyO3)],
    packages=["backtest", "other"],
    # rust extensions are not zip safe, just like C-extensions.
    zip_safe=False,
)