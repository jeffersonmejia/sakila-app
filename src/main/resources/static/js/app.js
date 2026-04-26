const d = document,
	API = '/films',
	$table = d.getElementById('filmsTable'),
	$inputId = d.getElementById('filmId'),
	$inputTitle = d.getElementById('title'),
	$inputLanguage = d.getElementById('languageId'),
	$inputRating = d.getElementById('rating'),
	$inputRentalDuration = d.getElementById('rentalDuration'),
	$inputRentalRate = d.getElementById('rentalRate'),
	$inputReplacementCost = d.getElementById('replacementCost'),
	$btnSave = d.getElementById('btnSave'),
	$btnPrev = d.getElementById('btnPrev'),
	$btnNext = d.getElementById('btnNext'),
	$pageInfo = d.getElementById('pageInfo'),
	$search = d.getElementById('search'),
	$btnSearch = d.getElementById('btnSearch')

let currentPage = 0
const pageSize = 8
let totalPages = 0
let languagesMap = {}

const ratingMap = {
	G: 'General Audience',
	PG: 'Parental Guidance',
	PG_13: 'Parents Strongly Cautioned',
	R: 'Restricted',
	NC_17: 'Adults Only',
}

async function loadLanguages() {
	const res = await fetch('/languages')
	const data = await res.json()
	const list = Array.isArray(data) ? data : (data.content ?? [])

	$inputLanguage.innerHTML = ''
	const opt = d.createElement('option')
	opt.value = ''
	opt.textContent = 'Language'
	$inputLanguage.appendChild(opt)

	languagesMap = {}

	list.forEach((l) => {
		languagesMap[l.languageId] = l.name
		const option = d.createElement('option')
		option.value = l.languageId
		option.textContent = l.name
		$inputLanguage.appendChild(option)
	})
}

function loadRatings() {
	$inputRating.innerHTML = ''

	const opt = d.createElement('option')
	opt.value = ''
	opt.textContent = 'Rating'
	$inputRating.appendChild(opt)

	Object.entries(ratingMap).forEach(([key, desc]) => {
		const option = d.createElement('option')
		option.value = key
		const label = key.replace('_', '-')
		option.textContent = `${label} (${desc})`
		$inputRating.appendChild(option)
	})
}

function createCell(text, label) {
	const td = d.createElement('td')
	td.setAttribute('data-label', label)
	td.textContent = text ?? ''
	return td
}

function createActionsCell(f) {
	const td = d.createElement('td')
	td.setAttribute('data-label', 'Actions')

	const btnEdit = d.createElement('button')
	btnEdit.className = 'edit'
	btnEdit.textContent = 'Edit'
	btnEdit.dataset.film = JSON.stringify(f)

	const btnDelete = d.createElement('button')
	btnDelete.className = 'delete'
	btnDelete.textContent = 'Delete'
	btnDelete.dataset.id = f.filmId

	td.appendChild(btnEdit)
	td.appendChild(btnDelete)

	return td
}

async function loadFilms() {
	try {
		const query =
			$search && $search.value ? `&title=${encodeURIComponent($search.value)}` : ''

		const res = await fetch(`${API}?page=${currentPage}&size=${pageSize}${query}`)
		const data = await res.json()

		$table.innerHTML = ''
		totalPages = data.totalPages ?? 1

		const list = data.content ?? []

		list.forEach((f) => {
			const tr = d.createElement('tr')

			tr.appendChild(createCell(f.filmId, 'No.'))
			tr.appendChild(createCell(f.title, 'Title'))
			tr.appendChild(createCell(languagesMap[f.languageId] || f.languageId, 'Language'))
			tr.appendChild(createCell(ratingMap[f.rating] || f.rating || '', 'Rating'))
			tr.appendChild(createActionsCell(f))

			$table.appendChild(tr)
		})

		updatePaginationUI()
	} catch (e) {
		console.error(e)
	}
}

function updatePaginationUI() {
	$btnPrev.disabled = currentPage === 0
	$btnNext.disabled = currentPage >= totalPages - 1

	if ($pageInfo) {
		$pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`
	}
}

function selectFilm(f) {
	$inputId.value = f.filmId
	$inputTitle.value = f.title
	$inputLanguage.value = f.languageId
	$inputRating.value = f.rating || ''
	$inputRentalDuration.value = f.rentalDuration
	$inputRentalRate.value = f.rentalRate
	$inputReplacementCost.value = f.replacementCost

	$btnSave.textContent = 'Update'
	$inputTitle.focus()
}

async function saveFilm() {
	const id = $inputId.value

	const payload = {
		title: $inputTitle.value,
		languageId: Number($inputLanguage.value),
		rating: $inputRating.value,
		rentalDuration: Number($inputRentalDuration.value),
		rentalRate: Number($inputRentalRate.value),
		replacementCost: Number($inputReplacementCost.value),
	}

	if (id) {
		await fetch(`${API}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
	} else {
		await fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
	}

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
	$inputRating.value = ''
	$inputRentalDuration.value = ''
	$inputRentalRate.value = ''
	$inputReplacementCost.value = ''
	$btnSave.textContent = 'Create'
}

function handleEdit($el) {
	const film = JSON.parse($el.dataset.film)
	selectFilm(film)
}

function handleDelete($el) {
	deleteFilm($el.dataset.id)
}

function handlePrev() {
	if (currentPage > 0) {
		currentPage--
		loadFilms()
	}
}

function handleNext() {
	if (currentPage < totalPages - 1) {
		currentPage++
		loadFilms()
	}
}

function handleSearch() {
	currentPage = 0
	loadFilms()
}

function init() {
	loadLanguages()
	loadRatings()
	loadFilms()
}

d.addEventListener('click', (e) => {
	if (e.target.id === 'btnSave') return saveFilm()
	if (e.target.id === 'btnPrev') return handlePrev()
	if (e.target.id === 'btnNext') return handleNext()
	if (e.target.id === 'btnSearch') return handleSearch()
	if (e.target.matches('.edit')) return handleEdit(e.target)
	if (e.target.matches('.delete')) return handleDelete(e.target)
})

d.addEventListener('DOMContentLoaded', init)
