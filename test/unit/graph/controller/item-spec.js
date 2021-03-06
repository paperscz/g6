const expect = require('chai').expect;
const G6 = require('../../../../src');

const div = document.createElement('div');
div.id = 'item-controller';
document.body.appendChild(div);

describe('item controller', () => {
  const graph = new G6.Graph({
    container: div,
    width: 500,
    height: 500
  });
  it('add & remove node', () => {
    const node = graph.addItem('node', { shape: 'circle', color: '#ccc', style: { x: 50, y: 50, r: 20, lineWidth: 2 } });
    expect(node).not.to.be.undefined;
    const nodes = graph.get('nodes');
    expect(nodes.length).to.equal(1);
    expect(nodes[0]).to.equal(node);
    const node2 = graph.addItem('node', { shape: 'rect', id: 'node', color: '#666', style: { x: 100, y: 100, width: 100, height: 70 } });
    expect(node2).not.to.be.undefined;
    expect(nodes.length).to.equal(2);
    expect(nodes[1]).to.equal(node2);
    graph.removeItem(node);
    expect(nodes.length).to.equal(1);
    expect(nodes[0]).to.equal(node2);
    graph.removeItem(node2);
    expect(nodes.length).to.equal(0);
  });
  it('remove node with multiple edges', () => {
    const node1 = graph.addItem('node', { id: 'node1', shape: 'circle', color: '#ccc', style: { x: 50, y: 50, r: 20, lineWidth: 2 } });
    const node2 = graph.addItem('node', { id: 'node2', shape: 'circle', color: '#ccc', style: { x: 50, y: 50, r: 20, lineWidth: 2 } });
    graph.addItem('node', { id: 'node3', shape: 'circle', color: '#ccc', style: { x: 50, y: 50, r: 20, lineWidth: 2 } });
    graph.addItem('edge', { id: 'edge1', source: 'node1', target: 'node2' });
    graph.addItem('edge', { id: 'edge2', source: 'node1', target: 'node3' });
    expect(node1.getEdges().length).to.equal(2);
    expect(node2.getEdges().length).to.equal(1);
    expect(graph.findById('edge1')).not.to.be.undefined;
    expect(graph.findById('edge2')).not.to.be.undefined;
    graph.removeItem(node1);
    expect(graph.findById('edge1')).to.be.undefined;
    expect(graph.findById('edge2')).to.be.undefined;
    expect(node2.getEdges().length).to.equal(0);
    graph.clear();
  });
  it('add & remove edge', () => {
    const node1 = graph.addItem('node', { shape: 'circle', color: '#ccc', x: 50, y: 50, size: 20, style: { lineWidth: 2 } });
    const node2 = graph.addItem('node', { shape: 'rect', id: 'node', x: 100, y: 100, color: '#666', size: [ 100, 70 ] });
    const edge = graph.addItem('edge', { id: 'edge', source: node1, target: node2 });
    expect(graph.get('edges').length).to.equal(1);
    expect(graph.get('edges')[0]).to.equal(edge);
    expect(Object.keys(graph.get('itemMap')).length).to.equal(3);
    expect(graph.get('itemMap').edge).to.equal(edge);
    expect(node1.getEdges().length).to.equal(1);
    expect(node2.getEdges().length).to.equal(1);
    graph.removeItem(edge);
    expect(graph.get('edges').length).to.equal(0);
  });
  it('add edge of nodes that do not exist', () => {
    expect(graph.addItem('edge', { id: 'edge', source: 'notExist', target: 'notExist' })).not.to.throw;
  });
  it('update', () => {
    const node = graph.addItem('node', { id: 'node', x: 100, y: 100, size: 50, color: '#ccc' });
    graph.update('node', { x: 150, y: 150 });
    const matrix = node.get('group').getMatrix();
    expect(matrix[6]).to.equal(150);
    expect(matrix[7]).to.equal(150);
    graph.update(node, { style: { fill: '#ccc' } });
    const shape = node.get('keyShape');
    expect(shape.attr('fill')).to.equal('#ccc');
  });
  it('fresh graph', done => {
    graph.clear();
    const node = graph.addItem('node', { id: 'node', x: 100, y: 100, size: 50 });
    const node2 = graph.addItem('node', { id: 'node2', x: 100, y: 200, size: 50 });
    const node3 = graph.addItem('node', { id: 'node3', x: 300, y: 100, size: 50 });
    const edge = graph.addItem('edge', { id: 'edge', source: node, target: node2 });
    graph.paint();
    let path = edge.get('keyShape').attr('path');
    expect(path[0][1]).to.equal(100);
    expect(path[0][2]).to.equal(125.5);
    expect(path[1][1]).to.equal(100);
    expect(path[1][2]).to.equal(174.5);
    edge.setTarget(node3);
    graph.refresh();
    setTimeout(() => {
      path = edge.get('keyShape').attr('path');
      expect(path[0][1]).to.equal(125.5);
      expect(path[0][2]).to.equal(100);
      expect(path[1][1]).to.equal(274.5);
      expect(path[1][2]).to.equal(100);
      done();
    }, 800);
  });
  it('show & hide item', () => {
    const node = graph.addItem('node', { id: 'node', x: 100, y: 100, size: 50 });
    const node2 = graph.addItem('node', { id: 'node2', x: 100, y: 100, size: 50 });
    const edge = graph.addItem('edge', { id: 'edge', source: node, target: node2 });
    graph.hideItem('node');
    expect(node.isVisible()).to.be.false;
    expect(edge.isVisible()).to.be.false;
    graph.showItem(node);
    expect(node.isVisible()).to.be.true;
    expect(edge.isVisible()).to.be.true;
  });
});
