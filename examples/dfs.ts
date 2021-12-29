
type TreeNode<T> = {
    value: T
    children: TreeNode<T>[]
}

const traverseIteratively = <T>(
    root: TreeNode<T>,
    callback: (v: TreeNode<T>) => void
): void => {
    const stack: Command[] = []
    type Command = {
        type: 'GO' | 'PERFORM_WORK'
        node: TreeNode<T>
    }

    stack.push({
        type: 'GO',
        node: root,
    })
    while (stack.length) {
        const {type, node} = stack.pop()!
        switch (type) {
            case 'GO':
                {
                    console.log("进:", node.value)

                    //由于栈式先进后出的任务，所以越靠后的任务需要越先入栈
                    stack.push({
                        node,
                        type: 'PERFORM_WORK',
                    })

                    for (let i = node.children.length - 1; i >= 0; --i) {
                        stack.push({
                            type: 'GO',
                            node: node.children[i],
                        })
                    }
                }
                break
            case 'PERFORM_WORK': {
                callback(node)
            }
        }
    }
}
export default function dfs() {
    const treeData = {
        value: '0',
        children: [
            {
                value: '1',
                children: [
                    {value: "1-1", children: [{value: "1-2", children: []}]}
                ]
            },
            {
                value: '2',
                children: [
                    {value: '2-1', children: []}
                ]
            }
        ]
    }
    traverseIteratively(treeData, function (node) {
        console.log("出:", node.value)
    })
}