document.addEventListener("DOMContentLoaded", () => {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
    true
  );
  req.send();
  req.onload = () => {
    const dataset = JSON.parse(req.responseText)
    const req2 = new XMLHttpRequest();
    req2.open(
      "GET",
      "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
      true
    );
    req2.send();
    req2.onload = () => {
      const geodata = JSON.parse(req2.responseText)
      
      const path = d3.geoPath()

      const w = 1200;
      const h = 670;
      const padding = 60;

      const keys = [3, 12, 21, 30, 39, 48, 57, 66]

      const svg = d3
        .select("span")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

      const tooltip = d3
        .select("#graph")
        .append("div")
        .attr("id", 'tooltip')
        .style("opacity", 0)
        .text("a simple tooltip")

    
      const legend = d3
        .select("#graph")
        .append("svg")
        .attr("id", 'legend')
        .attr("width", w)
        .attr("height", 100)

      const color = d3.scaleLinear()
        .domain(keys)
        .range(d3.schemeGreens[8])
      
      const findCounty = (id) => {
        return dataset.find(item => item["fips"] === id)
      }

      svg
        .append("g")
        .selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.counties).features)
        .join("path")
        .attr("fill", (d) => color(findCounty(d["id"])["bachelorsOrHigher"]))
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d) => findCounty(d["id"])["fips"])
        .attr("data-education", (d) => findCounty(d["id"])["bachelorsOrHigher"])
        .on("mouseover", function(d) {
          d3.select(this)
          tooltip
            .style("opacity", 1)
            .attr("data-education", this.getAttribute("data-education"))
            .text(`${findCounty(d["id"])["area_name"]}, ${findCounty(d["id"])["state"]}: ${findCounty(d["id"])["bachelorsOrHigher"]}%`)
        })
        .on("mouseout", function(d, i) {
          d3.select(this)
          tooltip.style("opacity", 0);
        });
      
      svg
        .append("path")
        .datum(topojson.mesh(geodata, geodata.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path)

      const size = 30

      legend
        .selectAll("blocks")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", (d,i) => (w - (size * 1.5 * keys.length)) / 2 + (i * (size * 1.5)) + 100)
          .attr("y", 10)
          .attr("width", size * 1.5)
          .attr("height", size / 2)
          .style("fill", (d) => color(d))
          .attr("stroke", "black")


      legend
        .selectAll("labels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", (d,i) => (w - (size * 1.5 * keys.length)) / 2 + (i * (size * 1.5)) + 100)
          .attr("y", 10 + (size * 1.1))
          .text((d) => `${d}%`)
          .attr("text-anchor", "middle")
      
    }
  };
});
