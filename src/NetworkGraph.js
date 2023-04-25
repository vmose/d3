import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const data = {
  nodes: [
    { id: 'A', group: 1 },
    { id: 'B', group: 2 },
    { id: 'C', group: 2 },
    { id: 'D', group: 3 },
    { id: 'E', group: 3 }
  ],
  links: [
    { source: 'A', target: 'B', value: 7 },
    { source: 'A', target: 'C', value: 3.9 },
    { source: 'B', target: 'D', value: -1.2 },
    { source: 'C', target: 'E', value: 2.5 }
  ]
};

const NetworkGraph = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', d => d3.schemeCategory10[d.group])
      .call(drag(simulation));

    node.append('title')
      .text(d => d.id);

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }, []);

  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return (
    <svg ref={ref} width="500" height="500"></svg>
  );
};

export default NetworkGraph