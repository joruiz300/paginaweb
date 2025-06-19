/**
 * FormValidator - Sistema avanzado de validación de formularios
 * Math AI Agency - Professional Form Validation
 */

class FormValidator {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            realTimeValidation: true,
            showProgressBar: true,
            antiSpam: true,
            customMessages: {},
            onSubmit: null,
            onValidationChange: null,
            ...options
        };
        
        this.fields = new Map();
        this.validationRules = new Map();
        this.isValid = false;
        this.startTime = Date.now();
        this.keystrokes = 0;
        this.mouseMoves = 0;
        this.fieldInteractions = new Set();
        
        this.init();
    }

    init() {
        this.setupFields();
        this.setupEventListeners();
        this.createProgressBar();
        this.setupAntiSpam();
        this.injectStyles();
    }

    setupFields() {
        const formFields = this.form.querySelectorAll('input, textarea, select');
        
        formFields.forEach(field => {
            if (field.type === 'submit' || field.type === 'button') return;
            
            const fieldConfig = {
                element: field,
                isValid: false,
                isTouched: false,
                isDirty: false,
                errors: [],
                rules: this.parseFieldRules(field)
            };
            
            this.fields.set(field.name || field.id, fieldConfig);
            this.setupFieldUI(field);
        });
    }

    parseFieldRules(field) {
        const rules = [];
        
        if (field.required) {
            rules.push({
                type: 'required',
                message: this.getMessage('required', field)
            });
        }
        
        if (field.type === 'email') {
            rules.push({
                type: 'email',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: this.getMessage('email', field)
            });
        }
        
        return rules;
    }

    setupFieldUI(field) {
        const container = field.closest('.input-flujo, .input-group') || field.parentElement;
        
        const validationContainer = document.createElement('div');
        validationContainer.className = 'validation-container';
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        validationContainer.appendChild(errorMessage);
        
        const successIcon = document.createElement('div');
        successIcon.className = 'success-icon';
        successIcon.innerHTML = '✓';
        validationContainer.appendChild(successIcon);
        
        container.appendChild(validationContainer);
        container.classList.add('form-field-container');
        field.classList.add('form-field-enhanced');
    }

    setupEventListeners() {
        this.fields.forEach((fieldConfig, fieldName) => {
            const field = fieldConfig.element;
            
            field.addEventListener('blur', () => {
                this.validateField(fieldConfig);
            });
            
            field.addEventListener('input', () => {
                fieldConfig.isDirty = true;
                if (fieldConfig.isTouched) {
                    clearTimeout(fieldConfig.validationTimeout);
                    fieldConfig.validationTimeout = setTimeout(() => {
                        this.validateField(fieldConfig);
                    }, 300);
                }
            });
        });
        
        this.form.addEventListener('submit', (e) => {
            this.onFormSubmit(e);
        });
    }

    setupAntiSpam() {
        if (!this.options.antiSpam) return;
        
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website_url';
        honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
        honeypot.tabIndex = -1;
        this.form.appendChild(honeypot);
    }

    validateField(fieldConfig) {
        const field = fieldConfig.element;
        const value = field.value.trim();
        const errors = [];
        
        fieldConfig.isTouched = true;
        
        fieldConfig.rules.forEach(rule => {
            const isValid = this.applyValidationRule(value, rule, field);
            if (!isValid) {
                errors.push(rule.message);
            }
        });
        
        fieldConfig.errors = errors;
        fieldConfig.isValid = errors.length === 0 && value.length > 0;
        
        this.updateFieldUI(fieldConfig);
        this.updateFormValidation();
    }

    applyValidationRule(value, rule, field) {
        switch (rule.type) {
            case 'required':
                return value.length > 0;
            case 'email':
                return !value || rule.pattern.test(value);
            default:
                return true;
        }
    }

    updateFieldUI(fieldConfig) {
        const container = fieldConfig.element.closest('.form-field-container');
        const errorMessage = container.querySelector('.error-message');
        const successIcon = container.querySelector('.success-icon');
        
        container.classList.remove('field-error', 'field-success');
        
        if (fieldConfig.errors.length > 0) {
            container.classList.add('field-error');
            errorMessage.textContent = fieldConfig.errors[0];
            errorMessage.style.display = 'block';
            successIcon.style.display = 'none';
        } else if (fieldConfig.isValid) {
            container.classList.add('field-success');
            errorMessage.style.display = 'none';
            successIcon.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
            successIcon.style.display = 'none';
        }
    }

    updateFormValidation() {
        const validFields = Array.from(this.fields.values()).filter(f => f.isValid);
        const totalFields = this.fields.size;
        
        this.isValid = validFields.length === totalFields && totalFields > 0;
        
        const submitButton = this.form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !this.isValid;
            submitButton.classList.toggle('form-valid', this.isValid);
        }
        
        this.updateProgressBar();
    }

    createProgressBar() {
        if (!this.options.showProgressBar) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'form-progress-fill';
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        
        const firstField = this.form.querySelector('input, textarea, select');
        if (firstField) {
            firstField.closest('.form-field-container, .input-flujo, .input-group').before(progressContainer);
        }
    }

    updateProgressBar() {
        const progressFill = this.form.querySelector('.form-progress-fill');
        if (!progressFill) return;
        
        const completedFields = Array.from(this.fields.values()).filter(f => f.isValid).length;
        const totalFields = this.fields.size;
        const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
        
        progressFill.style.width = `${progress}%`;
        progressFill.style.backgroundColor = progress === 100 ? '#10B981' : '#FF6B00';
    }

    onFormSubmit(event) {
        event.preventDefault();
        
        this.fields.forEach(fieldConfig => {
            if (!fieldConfig.isTouched) {
                fieldConfig.isTouched = true;
                fieldConfig.isDirty = true;
            }
            this.validateField(fieldConfig);
        });
        
        if (this.options.antiSpam && !this.passesAntiSpamCheck()) {
            console.warn('Form submission blocked: Failed anti-spam check');
            return false;
        }
        
        if (this.isValid) {
            if (this.options.onSubmit) {
                this.options.onSubmit(this.getFormData());
            } else {
                this.form.submit();
            }
        }
    }

    passesAntiSpamCheck() {
        const honeypot = this.form.querySelector('input[name="website_url"]');
        if (honeypot && honeypot.value.length > 0) {
            return false;
        }
        
        const completionTime = Date.now() - this.startTime;
        if (completionTime < 2000) {
            return false;
        }
        
        return true;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    getMessage(type, field) {
        const fieldName = field.dataset.label || field.placeholder || field.name || 'Campo';
        
        const messages = {
            required: `${fieldName} es obligatorio`,
            email: 'Ingresa un email válido'
        };
        
        return messages[type] || 'Valor inválido';
    }

    injectStyles() {
        if (document.getElementById('form-validator-styles')) return;
        
        const styles = `
            <style id="form-validator-styles">
                .form-field-container {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                
                .field-error .form-field-enhanced {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }
                
                .field-success .form-field-enhanced {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }
                
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    display: none;
                }
                
                .success-icon {
                    position: absolute;
                    right: 10px;
                    top: -35px;
                    color: #10b981;
                    font-weight: bold;
                    display: none;
                }
                
                .form-progress-bar {
                    width: 100%;
                    height: 4px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    margin-bottom: 1rem;
                }
                
                .form-progress-fill {
                    height: 100%;
                    background-color: #FF6B00;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                    width: 0%;
                }
                
                [type="submit"]:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                [type="submit"].form-valid {
                    background-color: #10b981;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Make available globally
window.FormValidator = FormValidator; 