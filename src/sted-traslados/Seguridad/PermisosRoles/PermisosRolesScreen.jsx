import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import API from '../../../store/api';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { CustomCard } from '../../../shared/card-custom';
import { rutaServidor } from '../../../routes/rutaServidor';

export const PermisosRolesScreen = () => {

    const [permisosRoles, setPermisosRoles] = useState([]);

    const cols = [
        { field: 'roleName', header: 'Nombre del Rol' },
        { field: 'permissions', header: 'Permisos' },
    ];

    const dt = useRef(null);

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const navigate = useNavigate();

    useEffect(() => {
        getPermisosRoles();
    }, [])

    //Obtener PermisosRoles
    const getPermisosRoles = async () => {

        const response = await API.get(`Permisos/GetAllRolesWithPermissions`);
        if (response.status == 200 || response.status == 204) {
            setPermisosRoles(response.data)
        }
    }

    //Para Anadir permisos al rol seleccionado
    const onEdit = (permisosRol) => {
        navigate(rutaServidor + '/seguridad/PermisosRolesCrear', { state: { permisosRol } })
    };

    /*
    //Eliminar
    const onDelete = (rowData) => {
        eliminarTipoVehiculo(rowData.idTipoVehiculo);
    };

    const eliminarTipoVehiculo = async (idTipoVehiculo) => {
        confirmarAccion({ titulo: 'Eliminar Tipo Vehiculo', mensaje: 'Estas seguro que deseas eliminar el Tipo Vehiculo?' })
        .then(async (result) => {

            if (result.isConfirmed) {

                try {
                    const response = await API.delete(`TipoVehiculos/${idTipoVehiculo}`);

                    if (response.status == 200 || response.status == 204) {
                        const updatedTipoVehiculo = tipovehiculos.filter(o => o.idTipoVehiculo != idTipoVehiculo);
                        setTipoVehiculos(updatedTipoVehiculo);

                        accionExitosa({ titulo: 'Tipo Vehiculo Eliminado', mensaje: 'El Tipo Vehiculo ha sido eliminado satisfactoriamente' });
                    } else {
                        accionExitosa({ titulo: 'Tipo Vehiculo Eliminado', mensaje: 'El Tipo Vehiculo ha sido eliminado satisfactoriamente' });
                    }
                } catch (error) {
                    accionFallida({ titulo: 'Tipo vehiculo no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Tipo vehiculo' });
                }

                const response = await API.delete(`TipoVehiculos/${idTipoVehiculo}`);

                if (response.status == 200 || response.status == 204) {
                    const updatedTipoVehiculo = tipovehiculos.filter(o => o.idTipoVehiculo != idTipoVehiculo);

                    setTipoVehiculos(updatedTipoVehiculo);

                    accionExitosa({ titulo: 'Tipo vehiculo Eliminado', mensaje: 'El Tipo vehiculo ha sido eliminado satisfactoriamente' });
                } else {
                    accionFallida({ titulo: 'Tipo vehiculo no pudo ser Eliminado', mensaje: 'Ha ocurrido un error al intentar eliminar al Tipo vehiculo' });
                }
            }
        }
        );
    }*/


    //Buscar
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        roleName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        permissions: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            roleName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            permissions: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('')
    }
    const clearFilter = () => {
        initFilters();
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" severity='secondary' label="Quitar Filtros" style={{ marginRight: "5px" }} outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </span>
            </div>
        );
    };



    //Generar Archivos
    const header = renderHeader();

    const customStyle = {
        backgroundColor: '#f2f2f2',
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, permisosRoles);
                doc.save('PermisosRoles.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(permisosRoles);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'PermisosRoles');
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    //Butom edit
    const actionButtons = (rowData) => {

        return (
            <div className='row'>
                <Button icon="pi pi-pencil" severity="warning" rounded style={{ marginRight: "5px" }} tooltip="Editar" aria-label="Añadir" onClick={() => onEdit(rowData)} />
                <label>Asignar Permisos</label>
                {/* <Button icon="pi pi-trash" rounded severity="danger" tooltip="Eliminar" onClick={() => onDelete(rowData)} /> */}
            </div>
        );
    };

    //Agregar Buttom
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button style={{ backgroundColor: "#2596be", borderColor: "#2596be" }} label="Agregar Nuevo Rol" icon="pi pi-plus right" iconPos='right' onClick={() => navigate(rutaServidor + "/seguridad/RoleCrear")} />
            </div>
        );
    };

    //Buttom docs
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3 justify-content-center justify-content-between">
                <Button type="button" tooltip='Descargar CSV' icon="pi pi-file" severity="secondary" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-excel" tooltip='Descargar Excel' severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{ marginRight: "5px" }} />
                <Button type="button" icon="pi pi-file-pdf" tooltip='Descargar PDF' style={{ 'backgroundColor': 'red', borderColor: 'white', color: 'white' }} rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        );
    };

    //Tabla
    return (
        <div className="mt-5">
            <CustomCard title="Roles y sus Permisos" >
                <div className="p-3">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" ref={dt} style={customStyle} value={permisosRoles} dataKey="idTipoVehiculo" filters={filters} filterDisplay="row"
                        globalFilterFields={['roleName', 'permissions']} header={header} emptyMessage="No data found.">
                        
                        <Column field="roleName" header="Nombre Rol" filter filterPlaceholder="Buscar por Rol" style={{ minWidth: '12rem' }} />
                        
                        <Column field="permissions" header="Permisos" filter filterPlaceholder="Buscar por Permisos" style={{ minWidth: '12rem' }} 
                        body={(rowData) => (
                            <React.Fragment>
                              {rowData.permissions.map((permission, index) => (
                                <React.Fragment key={index}>
                                  {permission}
                                  <br />
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          )}
                        />
                       
                            <Column header="Acción" body={actionButtons} style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </CustomCard>



        </div>
    );
}