
type Session = {
    listKey: string;
    itemId: string;
    data: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean
    }
}

export const isLoggedIn = (session: Session) => {
    return !!session
}

export const isUserItem = (session: Session) => {
    if (isUserAdmin(session)) {
        return true;
    }

    if (!isLoggedIn(session)) {
        return false 
    }

    return { user: { id:session.itemId }}

}

export const isUserAdmin = (session: Session) => {
    return !!session.data.isAdmin

}