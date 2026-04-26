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

const $errorTitle = d.getElementById('error-title')
const $errorLanguage = d.getElementById('error-languageId')
const $errorRating = d.getElementById('error-rating')
const $errorRentalDuration = d.getElementById('error-rentalDuration')
const $errorRentalRate = d.getElementById('error-rentalRate')
const $errorReplacementCost = d.getElementById('error-replacementCost')

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

function formatDate(dateStr) {
	if (!dateStr) return ''
	const d = new Date(dateStr)
	const day = String(d.getDate()).padStart(2, '0')
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const year = d.getFullYear()
	return `${day}/${month}/${year}`
}

function clearErrors() {
	;[
		$inputTitle,
		$inputLanguage,
		$inputRating,
		$inputRentalDuration,
		$inputRentalRate,
		$inputReplacementCost,
	].forEach((el) => el.classList.remove('error'))
	;[
		$errorTitle,
		$errorLanguage,
		$errorRating,
		$errorRentalDuration,
		$errorRentalRate,
		$errorReplacementCost,
	].forEach((el) => (el.textContent = ''))
}

function setError(input, errorEl, message) {
	input.classList.add('error')
	errorEl.textContent = message
}

function validateForm() {
	clearErrors()
	let valid = true

	if (!$inputTitle.value.trim()) {
		setError($inputTitle, $errorTitle, 'Required')
		valid = false
	}

	if (!$inputLanguage.value) {
		setError($inputLanguage, $errorLanguage, 'Required')
		valid = false
	}

	if (!$inputRating.value) {
		setError($inputRating, $errorRating, 'Required')
		valid = false
	}

	const rd = Number($inputRentalDuration.value)

	if (!$inputRentalDuration.value) {
		setError($inputRentalDuration, $errorRentalDuration, 'Required')
		valid = false
	} else if (rd <= 0) {
		setError($inputRentalDuration, $errorRentalDuration, '> 0')
		valid = false
	} else if (rd > 365) {
		setError($inputRentalDuration, $errorRentalDuration, 'Max 365')
		valid = false
	}

	const rr = Number($inputRentalRate.value)

	if (!$inputRentalRate.value) {
		setError($inputRentalRate, $errorRentalRate, 'Required')
		valid = false
	} else if (rr <= 0) {
		setError($inputRentalRate, $errorRentalRate, '> 0')
		valid = false
	}

	const rc = Number($inputReplacementCost.value)

	if (!$inputReplacementCost.value) {
		setError($inputReplacementCost, $errorReplacementCost, 'Required')
		valid = false
	} else if (rc <= 0) {
		setError($inputReplacementCost, $errorReplacementCost, '> 0')
		valid = false
	}

	return valid
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
		option.textContent = `${key.replace('_', '-')} (${desc})`
		$inputRating.appendChild(option)
	})
}

function createCell(text, label, icon) {
	const td = d.createElement('td')
	td.setAttribute('data-label', label)

	if (icon) {
		td.innerHTML = `<span class="material-symbols-outlined">${icon}</span><span>${text ?? ''}</span>`
	} else {
		td.textContent = text ?? ''
	}

	return td
}

function createActionsCell(f) {
	const td = d.createElement('td')
	td.setAttribute('data-label', 'Actions')

	const btnEdit = d.createElement('button')
	btnEdit.className = 'edit'
	btnEdit.dataset.film = JSON.stringify(f)
	btnEdit.innerHTML = `<span class="material-symbols-outlined">edit</span>`

	const btnDelete = d.createElement('button')
	btnDelete.className = 'delete'
	btnDelete.dataset.id = f.filmId
	btnDelete.innerHTML = `<span class="material-symbols-outlined">delete</span>`

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

		list.forEach((f, index) => {
			const tr = d.createElement('tr')

			const rowNumber = currentPage * pageSize + index + 1

			tr.appendChild(createCell(rowNumber, 'No.', null))
			tr.appendChild(createCell(f.title, 'Title', 'movie'))
			tr.appendChild(
				createCell(languagesMap[f.languageId] || f.languageId, 'Language', 'language'),
			)
			tr.appendChild(createCell(ratingMap[f.rating] || f.rating || '', 'Rating', 'star'))
			tr.appendChild(createCell(f.rentalDuration, 'Rental Duration', 'schedule'))
			tr.appendChild(createCell(f.rentalRate, 'Rental Rate', 'attach_money'))
			tr.appendChild(createCell(f.replacementCost, 'Replacement Cost', 'payments'))
			tr.appendChild(createCell(formatDate(f.lastUpdate), 'Last Update', 'event'))
			tr.appendChild(createActionsCell(f))

			$table.appendChild(tr)
		})

		updatePaginationUI()
	} catch (e) {}
}

function updatePaginationUI() {
	$btnPrev.disabled = currentPage === 0
	$btnNext.disabled = currentPage >= totalPages - 1
	$pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`
}

function selectFilm(f) {
	clearErrors()

	$inputId.value = f.filmId
	$inputTitle.value = f.title
	$inputLanguage.value = f.languageId
	$inputRating.value = f.rating || ''
	$inputRentalDuration.value = f.rentalDuration
	$inputRentalRate.value = f.rentalRate
	$inputReplacementCost.value = f.replacementCost

	$btnSave.textContent = 'Update'
}

async function saveFilm() {
	if (!validateForm()) return

	const id = $inputId.value

	const payload = {
		title: $inputTitle.value.trim(),
		languageId: Number($inputLanguage.value),
		rating: $inputRating.value,
		rentalDuration: Number($inputRentalDuration.value),
		rentalRate: Number($inputRentalRate.value),
		replacementCost: Number($inputReplacementCost.value),
	}

	try {
		let res

		if (id) {
			res = await fetch(`${API}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
		} else {
			res = await fetch(API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
		}

		await res.text()
	} catch (e) {}

	resetForm()
	loadFilms()
}

async function deleteFilm(id) {
	await fetch(`${API}/${id}`, { method: 'DELETE' })
	loadFilms()
}

function resetForm() {
	clearErrors()

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

d.addEventListener('input', (e) => {
	if (e.target.matches('input, select')) {
		e.target.classList.remove('error')
		const errorEl = d.getElementById(`error-${e.target.id}`)
		if (errorEl) errorEl.textContent = ''
	}
})

d.addEventListener('click', (e) => {
	const $editBtn = e.target.closest('.edit')
	const $deleteBtn = e.target.closest('.delete')

	if (e.target.id === 'btnSave') return saveFilm()
	if (e.target.id === 'btnPrev') return handlePrev()
	if (e.target.id === 'btnNext') return handleNext()
	if (e.target.id === 'btnSearch') return handleSearch()

	if ($editBtn) return handleEdit($editBtn)
	if ($deleteBtn) return handleDelete($deleteBtn)
})

d.addEventListener('DOMContentLoaded', init)
