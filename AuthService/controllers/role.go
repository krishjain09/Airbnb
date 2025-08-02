package controllers

import (
	"AuthService/dto"
	"AuthService/middlewares"
	"AuthService/services"
	"AuthService/utils"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type RoleController struct {
	RoleService services.RoleService
}

func NewRoleController(roleService services.RoleService) *RoleController {
	return &RoleController{
		RoleService: roleService,
	}
}
func (rc *RoleController) GetRoleById(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id") // Extract role ID from URL parameters
	if roleId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}
	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}
	role, err := rc.RoleService.GetRoleById(id)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch role", err)
		return
	}

	if role == nil {
		utils.WriteJsonErrorResponse(w, http.StatusNotFound, "Role not found", fmt.Errorf("role with ID %s not found", roleId))
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Role fetched successfully", role)

}

func (rc *RoleController) GetAllRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := rc.RoleService.GetAllRoles()
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch roles", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (rc *RoleController) CreateRole(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value(middlewares.Payload).(dto.CreateRoleRequestDTO)

	roles, err := rc.RoleService.CreateRole(payload.Name, payload.Description)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch roles", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (rc *RoleController) UpdateRole(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role Id is requred", fmt.Errorf("missing role id"))
	}

	roleId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}
	payload := r.Context().Value(middlewares.Payload).(dto.UpdateRoleRequestDTO)

	roles, err := rc.RoleService.UpdateRole(roleId, payload.Name, payload.Description)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch roles", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (rc *RoleController) GetRolePermissions(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	rolePermissions, err := rc.RoleService.GetRolePermissions(id)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch role permissions", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Role permissions fetched successfully", rolePermissions)
}

func (rc *RoleController) AssignPermissionToRole(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	if id == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role Id is requred", fmt.Errorf("missing role id"))
	}

	roleId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}
	payload := r.Context().Value(middlewares.Payload).(dto.AssignPermissionRequestDTO)

	roles, err := rc.RoleService.AddPermissionToRole(roleId, payload.PermissionId)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch roles", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (rc *RoleController) RemovePermissionFromRole(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role Id is requred", fmt.Errorf("missing role id"))
	}

	roleId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}
	payload := r.Context().Value(middlewares.Payload).(dto.RemovePermissionRequestDTO)

	err = rc.RoleService.RemovePermissionFromRole(roleId, payload.PermissionId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to remove permission from role", err)
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Permissions removed from role successfully", nil)
}

func (rc *RoleController) GetAllRolePermissions(w http.ResponseWriter, r *http.Request) {
	rolePermissions, err := rc.RoleService.GetAllRolePermissions()
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch all role permissions", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "All role permissions fetched successfully", rolePermissions)
}
