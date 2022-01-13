import m from './index'

class toDoDemo {
	constructor() {
		this.todos = []

		this.render = () =>
			m.render(
				document.getElementById('example'),

				{children: [this.showToDos()]}
			)

		this.render()
	}

	showToDos() {
		return m('div', [
			m('h3', 'ToDo示例'),

			m('input', {placeholder: '添加todo'}),

			m(
				'button',

				{
					onclick: (e) => this.addTodo(e),
				},

				'+'
			),

			m(
				'ul',

				this.todos.map((item, i) =>
					m('li', [
						m('span', item),

						m(
							'button',

							{
								onclick: () => this.removeTodo(i),
							},

							'-'
						),
					])
				)
			),
		])
	}

	removeTodo(i) {
		this.todos.splice(i, 1)

		this.render()
	}

	addTodo(e) {
		const input = e.target.previousSibling

		const todo = input.value

		if (!todo.trim()) return

		input.value = ''

		this.todos.push(todo)

		this.render()
	}
}

new toDoDemo()
