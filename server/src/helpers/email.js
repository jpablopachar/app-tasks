import nodemailer from 'nodemailer'

export const emailRegistration = async (data) => {
  const { email, nombre, token } = data

  console.log(data)

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  })

  try {
    await transport.sendMail({
      from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: 'UpTask - Comprueba tu cuenta',
      text: 'Comprueba tu cuenta en UpTask',
      html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
      <a href="${process.env.CLIENT}/confirm/${token}">Comprobar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>`
    })
  } catch (error) {
    console.log(error)
  }
}

export const emailForgetPassword = async (data) => {
  const { email, nombre, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Restablece tu contraseña',
    text: 'Restablece tu contraseña',
    html: `<p>Hola: ${nombre} has solicitado restablecer tu contraseña</p>
    <p>Sigue el siguiente enlace para generar una nueva contraseña: 
    <a href="${process.env.CLIENT}/confirm/${token}">Restablecer contraseña</a>
    <p>Si tu no creaste este email, puedes ignorar el mensaje</p>`
  })
}
