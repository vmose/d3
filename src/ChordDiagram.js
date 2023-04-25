import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const data = {
  matrix: [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907]
  ],
  names: ['Alpha', 'Beta', 'Gamma', 'Delta']
};

const ChordDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
      .radius(innerRadius);

    const color = d3.scaleOrdinal()
      .domain(d3.range(4))
      .range(['#000000', '#FFDD89', '#957244', '#F26223']);

    const chords = chord(data.matrix);

    const group = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .datum(chords);

    const groupPath = group.selectAll('.group')
      .data(chords.groups)
      .enter().append('g')
      .attr('class', 'group');

    groupPath.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.index))
      .style('stroke', '#ffffff');

    groupPath.append('text')
      .each(d => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 10})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text(d => data.names[d.index]);

    groupPath.append('title')
      .text(d => `${data.names[d.index]}: ${d.value}`);

    group.selectAll('.ribbon')
      .data(chords)
      .enter().append('path')
      .attr('class', 'ribbon')
      .attr('d', ribbon)
      .style('fill', d => color(d.source.index))
      .style('stroke', '#ffffff');

  }, []);

  return (
    <svg ref={ref} width="400" height="400"></svg>
  );
};

export default ChordDiagram;
