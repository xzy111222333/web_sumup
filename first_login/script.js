const form = document.getElementById('registration-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

function formatFieldName(input) {
  const map = {
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
  };
  return map[input.id] || input.id;
}

function showError(input, message) {
  const group = input.parentElement;
  group.className = 'form-item error';
  const small = group.querySelector('small');
  small.innerText = message;
}

function showSuccess(input, message) {
  const group = input.parentElement;
  group.className = 'form-item success';
  const small = group.querySelector('small');
  if (message) small.innerText = message;
}

function checkRequired(inputs) {
  let isValid = true;
  inputs.forEach((input) => {
    if (input.value.trim() === '') {
      showError(input, `${formatFieldName(input)}不能为空`);
      isValid = false;
    } else {
      showSuccess(input, '');
    }
  });
  return isValid;
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${formatFieldName(input)}至少需要${min}个字符`);
    return false;
  } else if (input.value.length > max) {
    showError(input, `${formatFieldName(input)}不能超过${max}个字符`);
    return false;
  }
  showSuccess(input, '');
  return true;
}

function checkEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input.value.trim())) {
    showSuccess(input, '');
    return true;
  }
  showError(input, '邮箱格式不正确');
  return false;
}

function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, '两次输入的密码不一致');
    return false;
  }
  showSuccess(input2, '');
  return true;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const isRequiredValid = checkRequired([
    username,
    email,
    password,
    confirmPassword,
  ]);
  let isFormValid = isRequiredValid;
  if (isRequiredValid) {
    const isUsernameValid = checkLength(username, 3, 15);
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkLength(password, 6, 25);
    const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);
    isFormValid =
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordsMatch;
  }

  if (isFormValid) {
    alert('注册成功！');
    form.reset();
    document.querySelectorAll('.form-item').forEach((group) => {
      group.className = 'form-item';
      const small = group.querySelector('small');
      if (small) small.innerText = '';
    });
  }
});

// 实时校验：blur 时提示，input 时清除错误并做轻量验证
function attachRealtimeValidation() {
  const inputs = [username, email, password, confirmPassword];

  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      // 必填校验
      if (input.value.trim() === '') {
        showError(input, `${formatFieldName(input)}不能为空`);
        return;
      }

      // 细分校验
      if (input === username) {
        checkLength(username, 3, 15);
      } else if (input === email) {
        checkEmail(email);
      } else if (input === password) {
        checkLength(password, 6, 25);
        // 同步确认密码提示
        if (confirmPassword.value.trim() !== '') {
          checkPasswordsMatch(password, confirmPassword);
        }
      } else if (input === confirmPassword) {
        checkPasswordsMatch(password, confirmPassword);
      }
    });

    input.addEventListener('input', () => {
      // 输入时先清除空值错误
      if (input.value.trim() !== '') {
        showSuccess(input, '');
      }

      // 动态规则
      if (input === email && input.value.includes('@')) {
        // 用户已经输入 @，尝试校验格式
        checkEmail(email);
      }
      if (input === username) {
        if (input.value.length >= 3) checkLength(username, 3, 15);
      }
      if (input === password) {
        if (input.value.length >= 6) checkLength(password, 6, 25);
        if (confirmPassword.value.trim() !== '') {
          checkPasswordsMatch(password, confirmPassword);
        }
      }
      if (input === confirmPassword) {
        if (confirmPassword.value.length > 0) {
          checkPasswordsMatch(password, confirmPassword);
        }
      }
    });
  });
}

attachRealtimeValidation();


