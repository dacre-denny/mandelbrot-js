export const createSlider = (id, value, onChange) => {

    const element = document.getElementById(id)

    element.value = value

    element.addEventListener('change', onChange)
}

export const createToggle = (id, value, onToggle) => {

    const element = document.getElementById(id)

    element.classList.toggle('toggled', value)

    element.addEventListener('click', () => {

        value = !value
        element.classList.toggle('toggled', value)

        onToggle()
    })
}

export const createButton = (id, onClick) => {

    const element = document.getElementById(id)

    element.addEventListener('click', onClick)
}

export const toggleDisabled = (id, disabled) => {

    const element = document.getElementById(id)

    if (disabled) {

        element.setAttribute('disabled', 'disabled')
    }
    else {

        element.removeAttribute('disabled')
    }
}