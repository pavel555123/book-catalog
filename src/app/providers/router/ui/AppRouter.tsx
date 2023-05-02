import { useCallback } from 'react'
import { Route, RouteProps, Routes } from 'react-router-dom'
import { routeConfig } from 'shared/config/routeConfig/routeConfig'

export const AppRouter = () => {
    const renderWithWrapper = useCallback((route: RouteProps) => {
        return (
            <Route
                key={route.path}
                path={route.path}
                element={route.element}
            />
        )
    }, [])

    return (
        <Routes>
            {Object.values(routeConfig).map(renderWithWrapper)}
        </Routes>
    )
}
