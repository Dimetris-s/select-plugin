class CustomSelect {

    optionHeight = 46
    borderWidth = 1
    constructor(element, options = {}) {
        this.element = document.querySelector(element)
        this.width = options.width || +this.element.style.width.slice(0, -2) || null
        this.optionsCount = options.optionsCount ? options.optionsCount : 5
        
        this.options = this.getSelectOptions(this.element)
        this.defaultOption = this.getDefaultOption(this.element) || this.options[0]
        this.currentValue = this.defaultOption.label

        this.select = this._createSelect({width: this.width})


        this.hideInitialSelect()
        this.element.parentNode.insertBefore(this.select, this.element)
        document.addEventListener('click', this._listener)
    }
    


    getDefaultOption(element) {
        const result = Array.from(element.options).find(el => el.defaultSelected === true)

        return result
    }
    getSelectOptions(element) {
        const result = Array.from(element.options).filter(el => el.disabled === false)

        return result
    }

    hideInitialSelect() {
        this.element.style.display = 'none'
    }

    open() {
        this.element.previousElementSibling.classList.add('opened')
    }

    close() {
        this.element.previousElementSibling.classList.remove('opened')
    }
    destroy() {
        this.element.style.display = 'block'
        this.select.remove()
        document.removeEventListener('click', this._listener)
    }

    changeCurrentValue() {
        this.element.previousElementSibling.querySelector('.select-text').textContent = this.currentValue
    }

    _createSelect(options) {
        const select = document.createElement('div')
        select.classList.add('select-wrap')
        select.style.maxWidth = options.width ? options.width + 'px' : '100%'
        select.append(this._createCurrentSelectValue())
        select.append(this._createSelectOptionsList())

        return select
    }
    _createCurrentSelectValue() {
        const block = document.createElement('div')
        block.classList.add('select-value')
        block.insertAdjacentHTML('afterbegin', `
        <span class="select-text">${this.currentValue}</span><span class="select-arrow"></span>
        `)
        block.addEventListener('click', () => {
            block.parentNode.classList.toggle('opened')
        })

        return block
    }
    _createSelectOptionsList() {
        const optionsList = document.createElement('ul')
        optionsList.classList.add('select-list')
        optionsList.style.maxHeight = (this.optionHeight * this.optionsCount + this.borderWidth).toString() + 'px'
        this.options.forEach(option => {
            optionsList.insertAdjacentHTML('beforeend', 
            `
            <li data-value=${option.value} class="${option.label === this.currentValue ? 'active' : ''} select-item">${option.label}</li> 
            `)
        })
        function removeActiveClass() {
            [...optionsList.children].forEach(item => item.classList.remove('active'))
        }
        optionsList.childNodes.forEach(item => {
            item.addEventListener('click', () => {
                removeActiveClass()
                this.currentValue = item.textContent
                this.close()
                this.changeCurrentValue()
                const i = setTimeout(() => {
                    item.classList.add('active')
                    clearTimeout(i)
                }, 200)
                this.element.value = item.dataset.value
            })
        })
        return optionsList
    }

    _listener = (evt) => {
        if(!evt.target.closest('.select-wrap')) this.close()
    }
}