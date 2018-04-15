Chipmunk Core
=============
[English (英語)](README.md)

Chipmunk（チップマンク、翻訳：シマリス）とは、楽しみのために作成されたLispっぽいプログラミング言語です。このパッケージには、Chipmunkインタプリタの実装が含まれる。Chipmunkプログラムを実行するには、[chipmunk-cli](https://github.com/escamilla/chipmunk-cli)と言うパッケージを見てください。

プログラム例
------
```
(do
  (def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

  (print-line (map factorial (range 10))))

[ (1 1 2 6 24 120 720 5040 40320 362880) ]
```

リソース
----
- [Chipmunk関数一覧](docs/functions.jp.md)
