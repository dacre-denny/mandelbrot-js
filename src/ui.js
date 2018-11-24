export const createSlider = (id, value, onChange) => {

    const element = document.getElementById(id)

    if (!element) return

    const updateValueDisplay = (text) => {

        element.parentElement.querySelector('span').innerText = text
    }

    element.value = value

    element.addEventListener('change', (event) => {

        updateValueDisplay(event.currentTarget.value)

        onChange(event)
    })

    updateValueDisplay(value)
}

export const createToggle = (id, value, onToggle) => {

    const element = document.getElementById(id)

    if (!element) return

    element.classList.toggle('toggled', value)

    element.addEventListener('click', (event) => {

        value = !value
        element.classList.toggle('toggled', value)

        onToggle(event)
    })
}

export const createButton = (id, onClick) => {

    const element = document.getElementById(id)

    if (!element) return

    element.addEventListener('click', onClick)
}