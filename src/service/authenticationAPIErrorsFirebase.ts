export const authenticationAPIErrorsFirebase = (error: string) => {
    let errorMessage;

    switch (error) {
        case 'auth/claims-too-large': 
            errorMessage = 'La carga útil de la reclamación que se entregó a setCustomUserClaims() supera el tamaño máximo de 1,000 bytes.';
        break;
        case 'auth/email-already-exists': 
            errorMessage = 'Otro usuario ya está utilizando el correo electrónico proporcionado. Cada usuario debe tener un correo electrónico único.';
        break;
        case 'auth/id-token-expired': 
            errorMessage = 'El token de ID de Firebase que se proporcionó está vencido.';
        break;
        case 'auth/id-token-revoked': 
            errorMessage = 'Se revocó el token de ID de Firebase.';
        break;
        case 'auth/insufficient-permission': 
            errorMessage = 'La credencial que se usó para inicializar el SDK de Admin no tiene permisos suficientes para acceder al recurso de Authentication solicitado. Consulta cómo configurar un proyecto de Firebase si necesitas ver la documentación para generar una credencial con los permisos apropiados y usarla a fin de autenticar los SDK de Admin.';
        break;
        case 'auth/internal-error': 
            errorMessage = 'El servidor de Authentication encontró un error inesperado cuando se intentaba procesar la solicitud. Para obtener información adicional, revisa la respuesta del servidor de autenticación, que debería estar incluida en el mensaje de error.';
        break;
        case 'auth/invalid-argument': 
            errorMessage = 'Se proporcionó un argumento no válido para un método de autenticación. El mensaje de error debe incluir información adicional.';
        break; 
        case 'auth/invalid-claims': 
            errorMessage = 'Los atributos personalizados del reclamo que se entregaron a setCustomUserClaims() no son válidos.';
        break; 
        case 'auth/invalid-continue-uri': 
            errorMessage = 'La URL de continuación debe ser una string de URL válida.';
        break;
        case 'auth/invalid-photo-url': 
            errorMessage = 'El valor que se proporcionó para la propiedad del usuario photoURL no es válido. Debe ser una URL de string.';
        break; 
        case 'auth/invalid-uid': 
            errorMessage = 'El uid proporcionado debe ser una string no vacía con un máximo de 128 caracteres.';
        break; 
        case 'auth/missing-uid': 
            errorMessage = 'Se requiere un identificador uid para la operación actual.';
        break; 
        case 'auth/email-already-in-use': 
            errorMessage = 'Otro usuario ya está utilizando el correo electrónico proporcionado. Cada usuario debe tener un correo electrónico único.';
        break;        
        case 'auth/invalid-email': 
            errorMessage = 'El valor que se proporcionó para la propiedad del usuario email no es válido. Debe ser una dirección de correo electrónico.';
        break;
        case 'auth/invalid-phone-number': 
            errorMessage = 'El valor que se proporcionó para la propiedad del usuario password no es válido. Debe ser una string con al menos seis caracteres.';
        break;
        case 'auth/invalid-password': 
            errorMessage = 'El valor que se proporcionó para phoneNumber no es válido. Debe ser una string de identificador que no esté vacía y que cumpla con el estándar';
        break;  
        case 'auth/user-not-found': 
            errorMessage = 'No existe ningún registro de usuario que corresponda al identificador proporcionado.';
        break;   
        case 'auth/wrong-password': 
            errorMessage = 'Contraseña invalida.';
        break;   
        default: 
            errorMessage = error;
        break;
    }   

    return errorMessage;
}