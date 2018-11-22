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