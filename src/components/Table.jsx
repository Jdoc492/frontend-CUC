import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/table.css";

export default function TaskTable() {
  const TASKS_API_URL = "http://localhost:5000/tasks";
  const RESOURCES_API_URL = "http://localhost:5000/resources";

  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: "",
    status: "Pendiente",
    resources: [],
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // console.error("Token no encontrado. Redirigiendo al login...");
      window.location.href = "/login";
      return;
    }

    fetchTasks();
    fetchResources();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${TASKS_API_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al obtener tareas");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      // console.error("Error al obtener las tareas:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch(`${RESOURCES_API_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al obtener recursos");

      const data = await response.json();
      setResources(data);
    } catch (error) {
      // console.error("Error al obtener los recursos:", error);
    }
  };

  const createTask = async (task) => {
    if (!task.title.trim() || !task.status) {
      toast.error("El título y el estado son obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${TASKS_API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Error al crear tarea");

      toast.success("Tarea creada con éxito.");
      fetchTasks();
      handleCloseTaskModal();
    } catch (error) {
      toast.error("Error al crear la tarea.");
      // console.error("Error al crear la tarea:", error);
    }
  };

  const editTask = async (task) => {
    if (!task.title.trim() || !task.status) {
      toast.error("El título y el estado son obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${TASKS_API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Error al editar tarea");

      toast.success("Tarea editada con éxito.");
      fetchTasks();
      handleCloseTaskModal();
    } catch (error) {
      toast.error("Error al editar la tarea.");
      // console.error("Error al editar la tarea:", error);
    }
  };

  const handleSave = () => {
    const selectedResourceIds = currentTask.resources.map((id) => parseInt(id, 10));

    const task = {
      title: currentTask.title.trim(),
      status: currentTask.status,
      resources: selectedResourceIds,
    };

    if (currentTask.id) {
      editTask({ ...task, id: currentTask.id });
    } else {
      createTask(task);
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`${TASKS_API_URL}/${taskToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tarea");

      toast.success("Tarea eliminada con éxito.");
      fetchTasks();
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar la tarea.");
      // console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleAdd = () => {
    setCurrentTask({ id: null, title: "", status: "Pendiente", resources: [] });
    setShowTaskModal(true);
  };

  const handleEdit = (task) => {
    setCurrentTask({
      id: task.id,
      title: task.title || "",
      status: task.status || "Pendiente",
      resources: Array.isArray(task.resources) ? task.resources.map((r) => r.id) : [],
    });
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setCurrentTask({ id: null, title: "", status: "Pendiente", resources: [] });
  };

  const handleConfirmDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const renderResourceOptions = () =>
    resources.length > 0 ? (
      resources.map((resource) => (
        <option key={resource.id} value={resource.id}>
          {resource.nombre || resource.name}
        </option>
      ))
    ) : (
      <option>Recursos</option>
    );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pendiente":
        return "badge-warning";
      case "En Progreso":
        return "badge-primary";
      case "Completada":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, maxWidth: "70px" },
    { name: "Tarea", selector: (row) => row.title, sortable: true, wrap: true },
    {
      name: "Estado",
      selector: (row) => (
        <span className={`badge ${getStatusBadge(row.status)}`}>{row.status}</span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Recursos",
      selector: (row) =>
        Array.isArray(row.resources)
          ? row.resources
              .map((id) => {
                const resource = resources.find((res) => res.id === id);
                return resource ? resource.nombre || resource.name : "";
              })
              .join(", ")
          : "Recursos",
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="action-buttons">
          <button onClick={() => handleEdit(row)} className="btn btn-warning btn-sm">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button onClick={() => handleConfirmDelete(row)} className="btn btn-danger btn-sm">
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <div className="container container">
      <div className="d-flex justify-content-between align-items-center m-3 flex-wrap">
        <button className="btn btn-success mb-2" onClick={handleAdd}>
          Nueva Tarea <FontAwesomeIcon icon={faCirclePlus} />
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        striped
        highlightOnHover
        pagination
        fixedHeader
      />

      <ToastContainer />

      {/* Modal para Agregar/Editar Tarea */}
      <Modal show={showTaskModal} onHide={handleCloseTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTask.id ? "Editar Tarea" : "Nueva Tarea"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Nombre de la Tarea</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre de la Tarea"
                value={currentTask.title || ""}
                onChange={(e) =>
                  setCurrentTask((prevTask) => ({ ...prevTask, title: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={currentTask.status || ""}
                onChange={(e) =>
                  setCurrentTask((prevTask) => ({ ...prevTask, status: e.target.value }))
                }
              >
                <option>Pendiente</option>
                <option>En Progreso</option>
                <option>Completada</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formResources">
              <Form.Label>Recursos Asociados</Form.Label>
              <Form.Select
                multiple
                value={currentTask.resources.map(String)}
                onChange={(e) =>
                  setCurrentTask((prevTask) => ({
                    ...prevTask,
                    resources: [...e.target.selectedOptions].map((opt) =>
                      parseInt(opt.value, 10)
                    ),
                  }))
                }
              >
                {renderResourceOptions()}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Confirmar Eliminación */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la tarea{" "}
          <strong>{taskToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
