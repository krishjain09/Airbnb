package db

import (
	"AuthService/models"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	GetById() (*models.User, error)
	Create() error
	GetAll() (*[]models.User, error)
	DeleteById(id int64) error
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

func (u *UserRepositoryImpl) DeleteById(id int64) error {
	fmt.Println("Deleting user in UserRepository with ID:", id)

	query := "DELETE from users WHERE id=?"

	result, err := u.db.Exec(query, id)

	if err != nil {
		fmt.Println("Error deleting user:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()

	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}

	if rowsAffected == 0 {
		fmt.Println("No user found with the given ID:", id, " rows affected:", rowsAffected)
		return err
	}

	fmt.Println("User deleted successfully with ID:", id)
	return nil
}

func (u *UserRepositoryImpl) GetAll() (*[]models.User, error) {
	fmt.Println("Retrieving all data from users...")
	query := "Select * from users "

	rows, err := u.db.Query(query)
	if err != nil {
		fmt.Println("Error founding data")
		return nil, err
	}

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			fmt.Println("Error scanning user:", err)
			return nil, err
		}
		users = append(users, user)
	}
	rowCloseErr := rows.Close()

	if rowCloseErr != nil {
		fmt.Println("Error closing rows:", rowCloseErr)
		return nil, rowCloseErr
	}

	if len(users) == 0 {
		fmt.Println("No users found")
		return nil, nil
	}

	for a := 0; a < len(users); a++ {
		fmt.Println("User:", users[a])
	}

	fmt.Println("Retrieved all users successfully")
	return &users, nil
}

func (u *UserRepositoryImpl) Create() error {
	fmt.Println("Creating user in repository")

	query := "Insert into users(username,email,password) values(?,?,?)"

	result, err := u.db.Exec(query, "ashish", "ashishjain1234@gmail.com", "ashish123")
	rowsAffected, rowErr := result.RowsAffected()

	if err != nil {
		fmt.Println("Error inserting user:", err)
		return err
	}

	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}

	if rowsAffected == 0 {
		fmt.Println("No rows were affected, user not created")
		return nil
	}

	fmt.Println("User created successfully, rows affected:", rowsAffected)

	return nil

}

func (u *UserRepositoryImpl) GetById() (*models.User, error) {
	fmt.Println("Fetching user in UserRepository")

	//Step 1: Prepare the SQL query

	query := "SELECT id , username , email , password , created_at, updated_at FROM users WHERE id = ?"

	//Step 2: Execute the query
	row := u.db.QueryRow(query, 1)

	//Step 3: Process the result
	user := &models.User{}

	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given ID")
			return nil, err
		}
		fmt.Println("Error scanning user:", err)
		return nil, err
	}
	//Step 4: Return the user
	fmt.Println("User fetched successfully:", user)
	return user, nil
}
