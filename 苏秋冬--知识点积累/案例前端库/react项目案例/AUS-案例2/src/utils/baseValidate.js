/**
 * qtip构造类
 * User: gaogy
 * Date: 2017/1/16
 * Time: 19:12
 */
function baseValidate(form, constraints) {
    let isValidate = false;
    let errors = window.validate(form, constraints, {fullMessages: false});
    showErrors(form, errors || {});
    if (errors) {
        isValidate = true;
    }

    return isValidate;
}

/**
 * 更新校验信息
 * @param form
 * @param errors
 */
function showErrors(form, errors) {
    // 遍历表单元素，显示校验信息
    let $Input = $('.form-control', form);
    for (let i = 0; i < $Input.length; i++) {
        showErrorsForInput($Input[i], errors && errors[$Input[i].name]);
    }
}

/**
 * 显示校验信息
 * @param form
 * @param errors
 */
function showErrorMessage(id, errors) {
    let $Input = $('#' + id);
    // 遍历表单元素，显示校验信息
    for (let i = 0; i < $Input.length; i++) {
        showErrorsForInput($Input[i], errors && errors[$Input[i].name]);
    }
}

/**
 * 显示指定容器的错误信息
 * @param input
 * @param errors
 */
function showErrorsForInput(input, errors) {
    let formGroup = closestParent(input.parentNode, 'form-group');
    let messages = $(formGroup).find('.messages');
    if (!formGroup) {
        return;
    }

    // 清除旧的校验信息
    resetFormGroup(formGroup);

    // 追加新的校验信息
    if (errors) {
        // 标记出错的容器
        $(formGroup).addClass('has-error');
        // formGroup.classList.add('has-error');
        // 追加校验信息
        for (let i = 0; i < errors.length; i++) {
            addError(messages, errors[i]);
        }
    }
}

/**
 * 发现具有指定类的父容器
 * @param child
 * @param className
 * @returns {*}
 */
function closestParent(child, className) {
    if (!child || child == document) {
        return null;
    }
    if ($(child).hasClass(className)) {
        // if (child.classList.contains(className)) {
        return child;
    } else {
        return closestParent(child.parentNode, className);
    }
}

/**
 * 重置校验信息
 * @param formGroup
 */
function resetFormGroup(formGroup) {
    // 清除样式
    $(formGroup).removeClass('has-error');
    $(formGroup).removeClass('has-success');
    // formGroup.classList.remove('has-error');
    // formGroup.classList.remove('has-success');
    // 清除校验信息
    let $formGroup = formGroup.querySelectorAll('.help-block.error');
    for (let i = 0; i < $formGroup.length; i++) {
        $formGroup[i].parentNode.removeChild($formGroup[i]);
    }
}

/**
 * 追加指定的校验信息 <p class='help-block error'>[message]</p>
 * @param messages
 * @param error
 */
function addError(messages, error) {
    var block = document.createElement('p');
    $(block).addClass('help-block error');
    // block.classList.add('help-block');
    // block.classList.add('error');
    block.innerText = error;
    messages.append(block);
}

export { baseValidate, showErrors, resetFormGroup, showErrorMessage};
