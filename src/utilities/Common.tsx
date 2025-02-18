const Common = () => {

    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName.charAt(0).toUpperCase() + (lastName?.charAt(0).toUpperCase() || '');
    };
    
    return { getInitials }
}

export default Common;