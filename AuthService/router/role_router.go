package router

import (
	"AuthService/controllers"
	"AuthService/middlewares"

	"github.com/go-chi/chi/v5"
)

type RoleRouter struct {
	roleController *controllers.RoleController
}

func NewRoleRouter(_roleController *controllers.RoleController) Router {
	return &RoleRouter{
		roleController: _roleController,
	}
}

func (rr *RoleRouter) Register(r chi.Router) {
	r.Get("/roles/{id}", rr.roleController.GetRoleById)
	r.Get("/roles", rr.roleController.GetAllRoles)
	r.With(middlewares.CreateRoleRequestValidator).Post("/roles",rr.roleController.CreateRole)
	r.With(middlewares.UpdateRoleRequestValidator).Put("/roles",rr.roleController.UpdateRole)

	//Roles permission operations
	r.Get("/roles/{id}/permissions", rr.roleController.GetRolePermissions)
	r.With(middlewares.AssignPermissionRequestValidator).Post("/roles/{id}/permissions", rr.roleController.AssignPermissionToRole)
	r.With(middlewares.RemovePermissionRequestValidator).Delete("/roles/{id}/permissions", rr.roleController.RemovePermissionFromRole)
	r.Get("/role-permissions", rr.roleController.GetAllRolePermissions)
}
