const d = document,
	API = '/films',
	$table = d.getElementById('filmsTable'),
	$inputId = d.getElementById('filmId'),
	$inputTitle = d.getElementById('title'),
	$inputLanguage = d.getElementById('languageId'),
	$btnPrev = d.getElementById('btnPrev'),
	$btnNext = d.getElementById('btnNext')

let currentPage = 0
const pageSize = 8

async function loadFilms() {
	try {
		const res = await fetch(`${API}?page=${currentPage}&size=${pageSize}`)
		let data = await res.json()

		$table.innerHTML = ''

		if (Array.isArray(data)) {
			data = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
		} else {
			data = data.content
		}

		data.forEach((f) => {
			$table.innerHTML += `
				<tr>
					<td>${f.filmId}</td>
					<td>${f.title}</td>
					<td>
						<button class="edit" data-id="${f.filmId}" data-title="${f.title}" data-lang="${f.languageId}">Edit</button>
						<button class="delete" data-id="${f.filmId}">Delete</button>
					</td>
				</tr>
			`
		})
	} catch (e) {
		console.error(e)
	}
}

function selectFilm(f) {
	$inputId.value = f.filmId
	$inputTitle.value = f.title
	$inputLanguage.value = f.languageId
}

async function createFilm() {
	await fetch(API, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			title: $inputTitle.value,
			languageId: Number($inputLanguage.value),
			rentalDuration: 3,
			rentalRate: 4.99,
			replacementCost: 19.99,
		}),
	})
	resetForm()
	loadFilms()
}

async function updateFilm() {
	const id = $inputId.value
	if (!id) return

	await fetch(`${API}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			title: $inputTitle.value,
			languageId: Number($inputLanguage.value),
			rentalDuration: 3,
			rentalRate: 4.99,
			replacementCost: 19.99,
		}),
	})
	resetForm()
	loadFilms()
}

async function deleteFilm(id) {
	await fetch(`${API}/${id}`, { method: 'DELETE' })
	loadFilms()
}

function resetForm() {
	$inputId.value = ''
	$inputTitle.value = ''
	$inputLanguage.value = ''
}

function handleLoad() {
	loadFilms()
}

function handleCreate() {
	createFilm()
}

function handleUpdate() {
	updateFilm()
}

function handleEdit($el) {
	const id = $el.dataset.id
	const title = $el.dataset.title
	const lang = $el.dataset.lang
	selectFilm({ filmId: id, title, languageId: lang })
}

function handleDelete($el) {
	deleteFilm($el.dataset.id)
}

function handlePrev() {
	if (currentPage > 0) currentPage--
	loadFilms()
}

function handleNext() {
	currentPage++
	loadFilms()
}

function init() {
	loadFilms()
}

d.addEventListener('click', (e) => {
	if (e.target.id === 'btnLoad') return handleLoad()
	if (e.target.id === 'btnCreate') return handleCreate()
	if (e.target.id === 'btnUpdate') return handleUpdate()
	if (e.target.id === 'btnPrev') return handlePrev()
	if (e.target.id === 'btnNext') return handleNext()
	if (e.target.matches('.edit')) return handleEdit(e.target)
	if (e.target.matches('.delete')) return handleDelete(e.target)
})

d.addEventListener('DOMContentLoaded', init)
