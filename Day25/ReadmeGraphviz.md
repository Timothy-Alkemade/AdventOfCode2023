
# How to visualize graph


Create Digraph in dot format:

```
node createDotDigraphFormat.mjs

To create file:
node.exe createDotDigraphFormat.mjs > graph.dot

```


Download [GraphViz](https://graphviz.gitlab.io/download/)

After download, create svg from dot-file


```
./Graphviz/bin/dot.exe -Tsvg graph.dot -o graph.svg

```
