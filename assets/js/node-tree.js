
//node tree
var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  },
  width = 960 - margin.right - margin.left,
  baseHeight = 240 - margin.top - margin.bottom;
  
  var i = 0,
  duration = 500,
  root,
  firstClick = true;
  
  var tree = d3.layout.tree()
  .size([baseHeight, width]);
  
  var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });
  
  var svg = d3.select("#tree-container").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", baseHeight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.json("https://lastfmfiddler.tomektomasik.pl/resources/music.json", function(error, genre) {
    if (error) throw error;
  
    root = genre;
    root.x0 = baseHeight / 2;
    root.y0 = 0;
  
    function collapseAll(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapseAll);
        d.children = null;
      }
    }
  
    collapseAll(root);
    centerNode(root); 
    update(root);
  });
  
  d3.select(self.frameElement).style("height", "1000px");
  
  function update(source) {
    centerNode(source);
  
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
  
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });
  
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);
  
    nodeEnter.append("rect")
      .attr("class", "node-bg")
      .attr("y", -15)
      .attr("x", function(d) {
        return d === root ? -60 : -5;
      })
      .attr("width", 10)
      .attr("height", 30)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", function(d) {
        return d.children || d._children ? "#f0f0f0" : "#000000";
      })
      .style("stroke", function(d) {
        return d.children || d._children ? "#f0f0f0" : "#000000";
      })
      .style("stroke-width", 1);
  
    nodeEnter.append("text")
      .attr("dy", ".35em")
      .style("fill", function(d) {
        return d.children || d._children ? "#000000" : "#ffffff";
      })
      .attr("x", function(d) {
        return d === root ? -15 : 0;
      })
      .attr("text-anchor", function(d) {
        return d === root ? "end" : "start";
      })
      .text(function(d) {
        return d.name + ((!d.children && !d._children) ? " ►" : "");
      })
      .style("fill-opacity", 1e-6);
  
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        if (firstClick && d === root) {
          return "translate(" + (d.y + 400) + "," + d.x + ")";
        } else {
          return "translate(" + d.y + "," + d.x + ")";
        }
      });
  
    nodeUpdate.select("rect")
      .attr("width", function(d) {
        var textLength = this.parentNode.querySelector("text").getComputedTextLength();
        return d === root ? Math.max(60, textLength + 10) : Math.max(20, textLength + 10);
      })
      .style("fill", function(d) {
        return d.children || d._children ? "#f0f0f0" : "#000000";
      })
      .style("stroke", function(d) {
        return d.children || d._children ? "#f0f0f0" : "#000000";
      });
  
    nodeUpdate.select("text")
      .style("fill-opacity", 1);
  
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
  
    nodeExit.select("rect")
      .attr("width", 1e-6);
  
    nodeExit.select("text")
      .style("fill-opacity", 1e-6);
  
    var link = svg.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });
  
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });
  
    link.transition()
      .duration(duration)
      .attr("d", diagonal);
  
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();
  
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  
    // count number of expanded nodes to calculate new height
    var expandedNodesCount = nodes.filter(function(d) {
      return d.children && d.children.length > 0;
    }).length;
  
    var newHeight = baseHeight + expandedNodesCount * 0.9 * 67 - 40;
    tree.size([newHeight, width]);
  
    d3.select("svg").transition().duration(duration)
      .attr("height", newHeight + margin.top + margin.bottom);
  
    svg.transition().duration(duration)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  
  function click(d) {
    if (d === root && firstClick) {
      firstClick = false;
    }
  
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    } else {
      playTrackFromServer(d.name);
      return; 
    }
  
    update(d);
  }
  
  function centerNode(source) {
    var nodes = tree.nodes(root);
    var height = Math.max(100, nodes.length * 30);
    var depth = Math.max.apply(Math, nodes.map(function(d) { return d.depth; }));
    var newHeight = Math.max(baseHeight, height);
  
    tree.size([newHeight, width]);
  
    var scale = newHeight / height;
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
      d.x = (d.x * scale) + (newHeight - height * scale) / 2;
    });
  
    // SVG height update
    d3.select("svg").transition().duration(duration)
      .attr("height", newHeight + margin.top + margin.bottom);
  
    svg.transition().duration(duration)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  
  function unfoldAll() {
    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
      }
    }
  
    if (firstClick) {
      firstClick = false;
    }
  
    expand(root);
    update(root);
  }
  
  function foldAll() {
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d.children.forEach(collapse);
        d.children = null;
      }
    }
  
    root.children.forEach(collapse);
    collapse(root);
  
    root.x0 = baseHeight / 2;
    root.y0 = 0;
    firstClick = true;  
  
    update(root);
  }
  