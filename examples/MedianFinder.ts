interface Comparable<T> {
    compareTo(that: T): number
    equals(that: T): boolean
}

class PriorityQueue<E extends number | string | Comparable<E>> {
    pq: E[] = []
    private _size = 0

    constructor(comparator?: (a: E, b: E) => boolean) {
        if (comparator) {
            console.log("----------------")
            this.less = (i: number, j: number) => {
                console.log("comparator", this.pq)
                return comparator(this.pq[i], this.pq[j])
            }
        }
    }

    size() {
        return this._size
    }

    isEmpty() {
        return this._size === 0
    }

    insert(e: E) {
        // size自增，在堆尾部插入元素
        this.pq[++this._size] = e
        // 执行上浮操作
        this.swim(this._size)
    }


    remove() {
        // 取出根节点的值
        const min = this.pq[1]

        // 根节点和尾节点交换位置
        this.exch(1, this._size)
        this._size--
        // 通过改变长度删除尾节点值
        this.pq.length = this._size + 1

        this.sink(1)

        return min
    }

    /**
     * 根据索引交换位置
     * @param i
     * @param j
     */
    private exch(i: number, j: number) {
        const t = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = t
    }

    /**
     * 下沉操作
     * @param k 
     */
    private sink(k: number) {
        while (2 * k <= this._size) {
            let j = 2 * k
            if (j + 1 <= this._size && this.less(j + 1, j)) j++

            if (this.less(k, j)) break

            this.exch(k, j)
            k = j
        }
    }

    /**
     * 上浮操作:从底部往上 循环执行
     * @param k 最后一个节点的索引
     */
    private swim(k: number) {
        let j: number
        // Math.floor(k / 2) 为 k的父节点索引值
        // 如果k大于1 且 父节点大于子节点
        while (k > 1 && this.less(k, (j = Math.floor(k / 2)))) {
            // 就调换父子节点位置
            this.exch(j, k)
            // 换位置后，需要更新操作元素的索引
            k = j
        }
    }

    /**
     * 根据索引比较元素
     * 
     * @param i 节点索引
     * @param j 节点索引
     * @returns 
     */
    private less(i: number, j: number): boolean {
        console.log(this.pq)
        if (typeof this.pq[i] === 'string' || typeof this.pq[i] === 'number') {
            return this.pq[i] < this.pq[j]
        } else {
            return (this.pq[i] as Comparable<E>).compareTo(this.pq[j]) < 0
        }
    }

    // 返回根节点值(数组内的第二个值，因为是从下标1开始的)
    peek(): null | E {
        return this.pq[1] ?? null
    }
}

class MedianFinder {
    // 小顶堆，存放大于中位数的值 堆顶是小的 [空白, 4, 5, 6, 8]
    private minPQ: PriorityQueue<number> = new PriorityQueue<number>()
    // 大顶堆，存放小于中位数的值 堆顶是大的 [空白, 3, 1, 2]
    private maxPQ: PriorityQueue<number> = new PriorityQueue<number>((a, b) => {
        return a > b
    })

    size(): number {
        return this.minPQ.size() + this.maxPQ.size()
    }

    addNum(v: number): void {
        // 如果是偶数
        if (this.size() % 2 === 0) {

            // 获取最大顶队的第一个值
            const max = this.maxPQ.peek()

            // max为null(说明是第一次添加)或者 当前添加值大于 大顶堆中的最大值
            if (max === null || max < v) {
                // 就给小顶堆添加
                this.minPQ.insert(v)
            } else {
                this.minPQ.insert(this.maxPQ.remove())
                this.maxPQ.insert(v)
            }
        } else {
            // 奇数情况下
            // 取出小顶堆的最小值
            const min = this.minPQ.peek()

            // 小顶堆为空 或者 小顶堆最小值 > 当前值，
            if (min === null || v < min) {
                // 说明属于大顶堆
                this.maxPQ.insert(v)
            } else {
                // 如果 当前值 >= 小顶 ，那这个值肯定属于小顶堆，
                // 此时需要移动小顶堆数据，以平衡大小堆数量，
                // 就用小顶值(this.minPQ.remove())插入到大顶堆中，再把当前值给小顶堆
                this.maxPQ.insert(this.minPQ.remove())
                this.minPQ.insert(v)
            }
        }
        // console.log("大堆", this.maxPQ.pq)
        // console.log("小堆", this.minPQ.pq)
    }

    findMedian(): number | null {
        const size = this.size()

        if (size === 0) return null

        if (size % 2 === 0) {
            return (this.minPQ.peek()! + this.maxPQ.peek()!) / 2
        } else {
            return this.minPQ.peek()
        }
    }
}


class Test<T extends number> {
    private list: Array<number> = [1, 2, 3, 4, 5]
    constructor(fn?: (i: T) => T) {
        // 覆盖 getNum方法
        if (fn) {
            this.getNum = function (i: T) {
                return this.list[fn(i)]
            }
        }
    }

    getNum = (i: T): number => {
        return this.list[i]
    }
}


export default function finder() {
    // const t1 = new Test((i: number) => ++i)
    // console.log(t1.getNum(1))
    // const t2 = new Test()
    // console.log(t2.getNum(1))
    /**
     * 使用两个优先级堆（priority heap），即一个大顶堆，存放小于中位数的值，以
     * 及一个小顶堆，存放大于中位数的值。这会将所有元素大致分为两半，中间的两个元素位于两个堆的堆顶。这样一来，要找出中间值就是小事一桩。
     */
    const mf = new MedianFinder()
    const heap = Array.from({length: 5}, (v, i) => i + 1)
    heap.map((item, i) => mf.addNum(item))
    console.log(`${heap}的中位数是：`)
    console.log(mf.findMedian())
}
