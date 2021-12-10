import React from '../packages/react'
import {createRoot, render} from '../packages/react-dom'
import {LayoutEffectDemo} from './LayoutEffect'
import {PriorityScheduling} from './PriorityScheduling'
import {StateEffectDemo} from './StateAndEffect'
import {TimeSlicingDemo} from './TimeSlicing'
import {TodoList} from './TodoList'
import {ChildrenReconcilerDemo} from './ChildrenReconciler'
import {MemorizedComponentDemo} from './MemorizedComponent'

createRoot(document.querySelector('#app')!).render(<MemorizedComponentDemo />)
// createRoot(document.querySelector('#app')!).render(<TodoList />)
// createRoot(document.querySelector('#app')!).render(<PriorityScheduling />)
// createRoot(document.querySelector('#app')!).render(<ChildrenReconcilerDemo />)
// createRoot(document.querySelector('#app')!).render(<LayoutEffectDemo />)
// createRoot(document.querySelector('#app')!).render(<StateEffectDemo />)
// createRoot(document.querySelector('#app')!).render(<TimeSlicingDemo />)
// render(<PriorityScheduling />, document.querySelector('#app')!)
// render(<StateEffectDemo />, document.querySelector('#app')!)
// render(<TimeSlicingDemo />, document.querySelector('#app')!)
interface Comparable<T> {
	compareTo(that: T): number
	equals(that: T): boolean
}

class PriorityQueue<E extends number | string | Comparable<E>> {
	private pq: E[] = []
	private _size = 0

	constructor(comparator?: (a: E, b: E) => boolean) {
		if (comparator) {
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

			if (j + 1 <= this._size && this.less(j + 1, j)) j++

			if (this.less(k, j)) break

			this.exch(k, j)
			k = j
		}
	}

	private swim(k: number) {
		let j: number
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

	peek(): null | E {
		return this.pq[1] ?? null
	}
}

class MedianFinder {
	private minPQ: PriorityQueue<number> = new PriorityQueue<number>()
	private maxPQ: PriorityQueue<number> = new PriorityQueue<number>((a, b) => {
		return a > b
	})

	size(): number {
		return this.minPQ.size() + this.maxPQ.size()
	}

	addNum(v: number): void {
		if (this.size() % 2 === 0) {
			const max = this.maxPQ.peek()

			if (max === null || max < v) {
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
const mf = new MedianFinder()
mf.addNum(1)
mf.addNum(2)
console.log(mf.findMedian())
mf.addNum(3)
console.log(mf.findMedian())
