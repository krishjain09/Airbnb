package db

import (
	"AuthService/models"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	GetById(id string) (*models.User, error)
	Create(username string, email string, password string) (id int64, err error)
	GetAll() (*[]models.User, error)
	DeleteById(id int64) error
	GetUserByEmail(email string) (*models.User, error)
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

func (u *UserRepositoryImpl) Create(username string, email string, hashedPassword string) (id int64,err error){
	fmt.Println("Creating user in repository")

	emailAlreadyExists, err := u.GetUserByEmail(email)

	if emailAlreadyExists != nil {
		fmt.Println("Email already exists. Please login..", emailAlreadyExists.Email, err)
		return -1,fmt.Errorf("email already exists. Please login")
	}

	query := "Insert into users(username,email,password) values(?,?,?)"

	result, err := u.db.Exec(query, username, email, hashedPassword)
	rowsAffected, rowErr := result.RowsAffected()

	if err != nil {
		fmt.Println("Error inserting user:", err)
		return -1,err
	}

	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return -1,rowErr
	}

	if rowsAffected == 0 {
		fmt.Println("No rows were affected, user not created")
		return -1,nil
	}
	fmt.Println("User created successfully, rows affected:", rowsAffected)
	
	id,idErr:=result.LastInsertId()
	fmt.Println("Id: ",id);
	if(idErr!=nil){
		return -1,idErr;
	}
	return id,idErr
}

func (u *UserRepositoryImpl) GetById(id string) (*models.User, error) {
	fmt.Println("Fetching user in UserRepository")

	//Step 1: Prepare the SQL query

	query := "SELECT id , username , email , password , created_at, updated_at FROM users WHERE id = ?"

	//Step 2: Execute the query
	row := u.db.QueryRow(query, id)

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

func (u *UserRepositoryImpl) GetUserByEmail(email string) (*models.User, error) {

	query := "SELECT username,password,id from users where email =?"

	row := u.db.QueryRow(query, email)

	user := &models.User{}

	err := row.Scan(&user.Username, &user.Password, &user.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given Email ID")
			return nil, fmt.Errorf("no user found with the given Email ID %s", email)
		}
		fmt.Println("Error scanning user:", err)
		return nil, err
	}

	return user, nil
}
