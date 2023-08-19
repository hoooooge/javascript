このパッケージは　https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js　に依存しています。

サンプル:

python = new Python();

python.pip.install('pandas')

python.run('print("hello world!")')




>> hello world!
