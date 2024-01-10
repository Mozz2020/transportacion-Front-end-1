import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from 'react';
import logo from '../../assets/logofa.png';
import { Container } from 'react-bootstrap';
import { rutaServidor } from "../../routes/rutaServidor";
import API from '../../store/api';
import { accionExitosa, accionFallida } from '../../shared/Utils/modals';
import { Menubar } from 'primereact/menubar';
import { useLocation } from 'react-router-dom';


export const NuevaClave = () => {
    
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const initialValues = {
        email: "",
        newPassword: "",
        confirmPassword: ""
    };

    const validationSchema = Yup.object({
        //email: Yup.string().required("El email es requerido"),
        newPassword: Yup.string().required("La contraseña es requerida"),
        confirmPassword: Yup.string().required("Debe confirmar su contraseña")
    });

    const formik = useFormik({
        initialValues,
        validationSchema,

        onSubmit: (values) => {
            const correo = location.state.datos.correoEmpleado;
           let nuevoPass = {
            email: correo,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword
            };
            postPassNew(nuevoPass);
          }
        });
        
      
        const postPassNew = async (datos) => {
            try{
                let response;
                response = await API.post("UserAccount/NuevaClaveRecuperarClave", datos);

                if (response.status == 200 || response.status == 204) {
                    setResponse(response.data);
                    accionExitosa({ titulo: 'Clave Recuperada', mensaje: JSON.stringify(response.data), buttonText:'Ir al Login'
                    }).then((result)=> {
                        if(result.isConfirmed){
                            localStorage.clear();
                            navigate(rutaServidor + '/auth/Login')
                        }
                    });
                    //

                } else {
                    accionFallida({ titulo: 'La clave no pudo ser recuperada', mensaje: 'Ha ocurrido un error inesperado' }); 
                }

            }catch(error){
                setError(error.response.data); 
                accionFallida({ titulo: 'La clave no pudo ser recuperada', mensaje: JSON.stringify(error.response.data) });
            }
            
        }
      
    //---------------------------------------------------------------------------------

    const items = [];

    const start = (
        <div>
            <img
                onClick={() => navigate( rutaServidor + "/inicio")}
                src={logo}
                style={{ 'marginLeft': '280px' }}
                width="200"
                alt="React Bootstrap logo"
            />
        </div>
    );


    return (<>
    
    <Menubar style={{ backgroundColor: '#050A30' }} model={items} start={start} />
        <div className="d-flex justify-content-center">
            <div className="mt-5 " style={{ width: '500px' }} >
                <Card style={{ "borderColor": "#2596be" }} className={`text-white text-center`}>
             
                    <Card.Body >
                    <Card.Title className={`text-black text-center mt-4 `}>Cree una Nueva Contraseña</Card.Title>
                    {/* <Card.Subtitle className="text-center mt-2 text-muted"> Coloque el correo para verificar su cuenta</Card.Subtitle> */}
                        <div className="p-3">
                            <div className="mt-1 text-start" style={{ color: 'black' }}>

                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            name="newPassword"
                                            type="text"
                                            placeholder="Introduzca su nueva contraseña"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.newPassword}
                                        />
                                        {formik.touched.newPassword && formik.errors.newPassword ? (
                                            <div className="text-danger">{formik.errors.newPassword}</div>
                                        ) : null}
                                    </Form.Group>


                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmar contraseña</Form.Label>
                                        <Form.Control
                                            name="confirmPassword"
                                            type="text"
                                            placeholder="Repita su contraseña"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmPassword}
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                            <div className="text-danger">{formik.errors.confirmPassword}</div>
                                        ) : null}
                                    </Form.Group>
                                    <div className="mt-2 d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            style={{ background: "#2596be", borderColor: "#2596be" }}>
                                                Guardar Contraseña
                                        </Button>
                                    </div>
                                    
                                </Form>

                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </>);
}