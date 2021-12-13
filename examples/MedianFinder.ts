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
        this.pq[++this._size] = e
        this.swim(this._size)
    }

    remove() {
        const min = this.pq[1]

        this.exch(1, this._size)
        this._size--
        this.pq.length = this._size + 1

        this.sink(1)

        return min
    }

    private exch(i: number, j: number) {
        const t = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = t
    }

    private sink(k: number) {
        while (2 * k <= this._size) {
            let j = 2 * k
            console.log(this.less)
            if (j + 1 <= this._size && this.less(j + 1, j)) j++

            if (this.less(k, j)) break

            this.exch(k, j)
            k = j
        }
    }

    private swim(k: number) {
        let j: number
        // console.log(this.less)
        while (k > 1 && this.less(k, (j = Math.floor(k / 2)))) {
            this.exch(j, k)
            k = j
        }
    }

    private less(i: number, j: number): boolean {
        if (typeof this.pq[i] === 'string' || typeof this.pq[i] === 'number') {
            return this.pq[i] < this.pq[j]
        } else {
            return (this.pq[i] as Comparable<E>).compareTo(this.pq[j]) < 0
        }
    }

    // 返回堆内第二个值 ，因为第一个是空白
    peek(): null | E {
        return this.pq[1] ?? null
    }
}

class MedianFinder {
    // 小顶堆，存放大于中位数的值 堆顶是小的 [空白, 4, 3, 2, 1]
    private minPQ: PriorityQueue<number> = new PriorityQueue<number>()
    // 大顶堆，存放小于中位数的值 堆顶是大的 [空白, 5, 8, 6, 10]
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
            const min = this.minPQ.peek()

            if (min === null || v < min) {
                this.maxPQ.insert(v)
            } else {
                this.maxPQ.insert(this.minPQ.remove())
                this.minPQ.insert(v)
            }
        }
        console.log("大堆", this.maxPQ.pq)
        console.log("小堆", this.minPQ.pq)
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

export default function finder() {
    /**
     * 使用两个优先级堆（priority heap），即一个大顶堆，存放小于中位数的值，以
     * 及一个小顶堆，存放大于中位数的值。这会将所有元素大致分为两半，中间的两个元素位于两个堆的堆顶。这样一来，要找出中间值就是小事一桩。
     */
    const mf = new MedianFinder()
    mf.addNum(1)
    mf.addNum(2)
    mf.addNum(3)
    mf.addNum(4)
    mf.addNum(5)
    mf.addNum(6)
    mf.addNum(8)
    mf.addNum(10)
    mf.addNum(11)
    mf.addNum(9)
    mf.addNum(7)
    console.log(mf.findMedian())
}
