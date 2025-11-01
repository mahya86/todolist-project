const $ = document

const get = $.getElementById.bind($)

const modalOverlay = get('modal-overlay'),
    userNameModal = get('user-name-modal'),
    userName = get('user-name'),
    closeModalBtn = get('close-modal-btn'),
    userNameLabel = get('user-name-label'),
    userNameInput = get('user-name-input'),
    okModalBtn = get('ok-modal-btn'),
    editNameBtn = get('edit-name-btn'),
    themeToggleBtn = get('theme-toggle-btn'),
    themeToggleIcon = get('theme-toggle-icon'),
    newTodoInput = get('new-todo-input'),
    addTodoBtn = get('add-todo-btn'),
    colorPicker = get('color-picker'),
    bgColors = [...colorPicker.children],
    todoSection = get('todo-section'),
    todoList = get('todo-list'),
    doneSection = get('done-section'),
    doneList = get('done-list')

let selectedColor = '',
    todos = JSON.parse(localStorage.getItem('todos')) || [],
    done = JSON.parse(localStorage.getItem('done')) || []


const updateThemeToggleIcon = () => themeToggleIcon.classList.replace(
    $.documentElement.classList.contains('dark') ? 'fa-moon' : 'fa-sun',
    $.documentElement.classList.contains('dark') ? 'fa-sun' : 'fa-moon'
)

const showUserNameModal = () => {
    modalOverlay.classList.remove('hidden')
    userNameModal.classList.replace('-top-50', 'top-0')
    userNameInput.focus()
}

const hideUserNameModal = () => {
    modalOverlay.classList.add('hidden')
    userNameModal.classList.replace('top-0', '-top-50')
    userNameLabel.classList.remove('text-red-600', 'dark:text-red-800', 'xs:text-sm', 'lg:text-sm')
    userNameLabel.classList.add('mr-auto', 'ml-6')
    userNameLabel.classList.remove('text-center')
    userNameLabel.textContent = 'Write your name:'
    userNameInput.classList.remove('border-red-600', 'dark:border-red-800', 'focus:outline-none')
    newTodoInput.focus()
}

const createLi = (text, isDone, bgColor) => {
    const li = $.createElement('li')
    if (!isDone) {
        li.dataset.color = bgColor
    }

    li.className = `p-3 shadow border border-gray-200  rounded-sm flex justify-between items-center h-20 ${!isDone ? `${bgColor} dark:border-gray-600` : `dark:bg-neutral-900 dark:border-gray-700`}`
    li.innerHTML = `
    <span class="text-sm xs:text-base text-gray-500 ${!isDone ? `dark:text-gray-400` : `dark:text-gray-600 line-through decoration-gray-500 dark:decoration-gray-600`}">${text}</span>
                    <div class="flex flex-col xs:flex-row gap-1 xs:gap-0.5">
                    ${!isDone ? `
                        <button type="button" id="done-btn" class="text-xs xs:text-sm bg-emerald-500 dark:bg-emerald-700 rounded-3xl shadow-md cursor-pointer text-white dark:text-gray-300 h-8 w-14 xs:w-16 hover:bg-emerald-600 dark:hover:bg-emerald-800 hover:shadow-lg active:scale-75 transition-all duration-200">
                            <i class="fas fa-check"></i>
                            Done
                        </button>` : ''}
                        <button type="button" class="delete-btn text-xs xs:text-sm px-0.5 bg-red-500 dark:bg-red-700 rounded-3xl shadow-md cursor-pointer text-white dark:text-gray-300 h-8 w-14 xs:w-17 hover:bg-red-600 dark:hover:bg-red-800 hover:shadow-lg active:scale-75 transition-all duration-200">
                            <i class="fas fa-trash-alt"></i>
                            Delete
                        </button>
                    </div>
                    `
    isDone ? doneList.appendChild(li) : todoList.appendChild(li)
}

const displayTodoSection = () => todoSection.classList.toggle('hidden', todoList.children.length === 0)
const displayDoneSection = () => doneSection.classList.toggle('hidden', doneList.children.length === 0)

const saveLists = () => {
    todos = [...todoList.children].map(li => ({
        text: li.querySelector('span').textContent,
        color: li.dataset.color
    }))
    done = [...doneList.children].map(li => li.querySelector('span').textContent)

    localStorage.setItem('todos', JSON.stringify(todos))
    localStorage.setItem('done', JSON.stringify(done))
}


const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
$.documentElement.classList.toggle('dark', theme === 'dark')
updateThemeToggleIcon()


window.addEventListener('load', () => {
    setTimeout(() => {
        get('loading-screen').remove()
        const localStorageName = localStorage.getItem('name')
        if (localStorageName) {
            userName.textContent = localStorageName
            newTodoInput.focus()
        } else {
            showUserNameModal()
        }
    }, 1000)

    const firstColor = colorPicker.querySelector('div')
    selectedColor = firstColor.dataset.color
    firstColor.classList.add('scale-125')

    todos.forEach(todo => createLi(todo.text, false, todo.color))
    done.forEach(done => createLi(done, true))

    displayTodoSection()
    displayDoneSection()
})

closeModalBtn.addEventListener('click', () => hideUserNameModal())

okModalBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim()
    if (name) {
        userName.textContent = name
        localStorage.setItem('name', name)
        hideUserNameModal()
    } else {
        userNameLabel.classList.add('text-red-600', 'dark:text-red-800', 'xs:text-sm', 'lg:text-sm')
        userNameLabel.classList.remove('mr-auto', 'ml-6')
        userNameLabel.classList.add('text-center')
        userNameLabel.textContent = 'Please write your name correctly:'
        userNameInput.classList.add('border-red-600', 'dark:border-red-800', 'focus:outline-none')
        userNameInput.focus()
    }
    userNameInput.value = ''
})

userNameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        okModalBtn.click()
    }
})

editNameBtn.addEventListener('click', () => showUserNameModal())

themeToggleBtn.addEventListener('click', () => {
    $.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', $.documentElement.classList.contains('dark') ? 'dark' : 'light')
    updateThemeToggleIcon()
})

bgColors.forEach(colorDiv => {
    colorDiv.addEventListener('click', () => {
        bgColors.forEach(div => div.classList.remove('scale-125'))
        colorDiv.classList.add('scale-125')
        selectedColor = colorDiv.dataset.color
        newTodoInput.focus()
    })
})

addTodoBtn.addEventListener('click', e => {
    const todo = newTodoInput.value.trim()
    if (todo) {
        createLi(todo, false, selectedColor)
        displayTodoSection()
        saveLists()
    }

    newTodoInput.value = ''
    newTodoInput.focus()
})

newTodoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        addTodoBtn.click()
    }
})

$.addEventListener('click', e => {
    const li = e.target.closest('li')

    if (e.target.closest('#done-btn')) {
        createLi(li.querySelector('span').textContent, true)
        li.remove()
    }

    if (e.target.classList.contains('delete-btn')) {
        li.remove()
    }

    saveLists()
    displayTodoSection()
    displayDoneSection()
})  
