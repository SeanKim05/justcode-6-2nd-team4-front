import React, { useState, useEffect, useRef } from 'react';
import Button from '../Button/Button';
import styles from './Modal.module.scss';
import { useNavigate } from 'react-router-dom';

const EMAIL_REGEX = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{1,24}$/;

function LoginModal(props) {
  const pwdRef = useRef('');
  const emailRef = useRef('');
  const invalidRef = useRef('');

  const [pwd, setPwd] = useState('');
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState('');

  const [validPwd, setValidPwd] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const navigate = useNavigate();
  const goMain = () => {
    navigate('/');
  };

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  const postInfoHandler = e => {
    e.preventDefault();

    fetch('http://localhost:10010/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        pwd: pwdRef.current.value,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('id', data.id);

          goMain();
        } else {
          setInvalid('activated');
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <>
      {!props.open ? null : (
        <>
          <div className={styles.overlay} />

          <div className={styles.container}>
            <div className={styles.close_btn} onMouseDown={props.onClose}>
              X
            </div>
            <div className={styles.modal_title}>
              <h1>로그인</h1>
              <p>사조의 공방 로그인 페이지 입니다</p>
              <p
                ref={invalidRef}
                className={
                  invalid ? `${styles.errPopUp}` : `${styles.offscreen}`
                }
                aria-live="assertive"
              >
                Please, Check Your E-mail and Password.
              </p>
            </div>

            <section className={styles.modal_input_border}>
              <div className={styles.modal_input_wrapper}>
                <div>아이디</div>
                <input
                  id="id"
                  placeholder="이메일 입력"
                  ref={emailRef}
                  autoComplete="off"
                  onChange={e => setEmail(e.target.value)}
                />

                <p
                  id="emailNote"
                  className={
                    email && !validEmail
                      ? `${styles.cond_msg}`
                      : `${styles.offscreen}`
                  }
                >
                  이메일 형식은 @ .com 입니다. 이메일을 확인해주세요.
                </p>
              </div>

              <div className={styles.modal_input_wrapper}>
                <div>비밀번호</div>
                <input
                  placeholder="비밀번호 입력"
                  type="password"
                  ref={pwdRef}
                  onChange={e => setPwd(e.target.value)}
                />
                <p
                  id="pwdNote"
                  className={
                    pwd && !validPwd
                      ? `${styles.cond_msg}`
                      : `${styles.offscreen}`
                  }
                >
                  비밀번호는 알파벳 대소문자 특수기호 숫자조합입니다.
                </p>
              </div>
            </section>
            <Button
              inputValue={!validPwd || !validEmail ? true : false}
              event={postInfoHandler}
              title="확인"
            />
          </div>
        </>
      )}
    </>
  );
}

export default LoginModal;
