class FetchError extends Error {
  constructor(response) {
    super(`HTTP error ${response.status}`);
    this.response = response;
  }
}
function fetchJSON(...args) {
  return fetch(...args).then((response) => {
    if (!response.ok) {
      throw new FetchError(response);
    }
    return response.json();
  });
}
function fetchText(...args) {
  return fetch(...args).then((response) => {
    if (!response.ok) {
      throw new FetchError(response);
    }
    return response.text();
  });
}

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

fetchJSON(url).then((result) => {
  let data = result;

  //console.log(data);

  const w = 1100;
  const h = 700;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const innerWidth = w - margin.left - margin.right;
  const innerHeight = h - margin.top - margin.bottom;

  const colors = [
    "#f1948a",
    "#c39bd3",
    "#85c1e9",
    "#76d7c4",
    "#82e0aa",
    "#f7dc6f",
    "#f0b27a",
    "#d7dbdd"
  ];

  const categories = data.children.map((d) => d.name);
  const colorScale = d3
    .scaleOrdinal() // the scale function
    .domain(categories) // the data
    .range(colors);

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const root = d3
    .hierarchy(data, (node) => node.children)
    .sum((node) => node.value)
    .sort((node1, node2) => node2.value - node1.value);
  // Here the size of each leave is given in the 'value' field in input data

  console.log(root)

  d3
    .treemap()
    .size([w, h])
    (root);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .style("stroke", "black")
    .style(
      "fill",
      (d) => colorScale(d.data.category)
    )
    .on("mousemove", function (d, i) {
      console.log(i)
      tooltip
        .html(
          i.data.name + "<br>" + i.data.category + "<br>" + "$" + parseInt(i.data.value).toLocaleString('en-US')
        )
        .attr("data-value", i.data.value)
        .style("left", d.pageX + 5 + "px")
        .style("top", d.pageY - 50 + "px");
      tooltip.style("opacity", 0.9);
      tooltip.attr("id", "tooltip");
      var colorChange = d3.select(this);
    })
    .on("mouseout", function () {
      var colorChange = d3.select(this);
      tooltip.style("opacity", 0);
    });

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .selectAll("tspan")
    .data((d) => {
      return d.data.name
        .split(/(?=[A-Z][^A-Z])/g) // split the name of movie
        .map((v) => {
          return {
            text: v,
            x0: d.x0, // keep x0 reference
            y0: d.y0 // keep y0 reference
          };
        });
    })
    .enter()
    .append("tspan")
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d, i) => d.y0 + 15 + i * 10)
    .text((d) => d.text)
    .attr("font-size", "0.6rem")
    .attr("fill", "black")
    
});
