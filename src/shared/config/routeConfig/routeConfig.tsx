import { type RouteProps } from 'react-router-dom'
import { MainPage } from 'pages/MainPage'
import { BookDetailsPage } from 'pages/BookDetailsPage'
import { NotFoundPage } from "../../../pages/NotFoundPage";

export enum AppRoutes {
    MAIN = 'main',
    BOOK_DETAILS = 'book_details',
    NOT_FOUND = 'not_found'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.BOOK_DETAILS]: '/book/', // + :id
    [AppRoutes.NOT_FOUND]: '*'
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath[AppRoutes.MAIN],
        element: <MainPage/>
    },
    [AppRoutes.BOOK_DETAILS]: {
        path: `${RoutePath[AppRoutes.BOOK_DETAILS]}:id`,
        element: <BookDetailsPage/>
    },
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath[AppRoutes.NOT_FOUND],
        element: <NotFoundPage/>
    }
}
