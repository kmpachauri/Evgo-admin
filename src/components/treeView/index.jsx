import React, { useEffect, useRef, useState } from 'react'
import Tree from 'react-d3-tree'
import useAxios from '../../hooks/useAxios'

const transformApiTreeToD3 = (node) => {
  if (!node) return null

  const transformedNode = {
    name: node.name || 'Node',
    attributes: {
      level: node.level || 1,
    },
    children: [],
  }

  const left = transformApiTreeToD3(node.leftChild)
  const right = transformApiTreeToD3(node.rightChild)

  if (left) transformedNode.children.push(left)
  if (right) transformedNode.children.push(right)

  return transformedNode
}

export default function OrgChartTree() {
  const { fetchData } = useAxios()
  const [treeData, setTreeData] = useState(null)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })

  const treeContainerRef = useRef(null)

  const getLevels = async () => {
    try {
      const res = await fetchData({
        url: '/api/v1/admin/tree',
      })
      const formattedTree = transformApiTreeToD3(res.data)
      setTreeData(formattedTree)
    } catch (error) {
      console.error('Error fetching tree data:', error)
    }
  }

  useEffect(() => {
    getLevels()
  }, [])

  // Center the tree when container is ready and tree data is loaded
  useEffect(() => {
    if (treeContainerRef.current && treeData) {
      const { offsetWidth, offsetHeight } = treeContainerRef.current
      setTranslate({ x: offsetWidth / 2.5, y: offsetHeight / 8 }) // adjust Y as needed
    }
  }, [treeData])

  return (
    <div id="treeWrapper" ref={treeContainerRef} style={{ width: '100vw', height: '90vh' }}>
      {treeData && (
        <Tree
          data={treeData}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          orientation="vertical"
          translate={translate}
          enableLegacyTransitions={true}
        />
      )}
    </div>
  )
}
