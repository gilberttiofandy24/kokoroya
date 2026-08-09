package main

// TODO: import "kokoroya-backend/internal/router" once router/gin wiring is implemented

func main() {
	a, err := InitializeApp()
	if err != nil {
		panic(err)
	}
	defer a.DB.Close()
	defer a.Redis.Close()

	a.Logger.Infof("%s starting on port %s (env=%s)", a.Config.App.Name, a.Config.App.Port, a.Config.App.Env)

	// TODO: engine := router.New(a.DB, a.Redis)
	// TODO: engine.Run(":" + a.Config.App.Port)
}
