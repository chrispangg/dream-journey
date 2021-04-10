import React from 'react';
import { makeStyles, Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
    root: { minWidth: 50 },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)'
    },
    title: { fontSize: 30 },
    pos: {marginBottom: 12}
});

const TripListCard = () => {
    const materialClass = useStyles();
    const { pathname } = useLocation();

    return (
        <Card className={ materialClass.root }>
            <CardContent>
                <Typography className={ materialClass.title } color="textSecondary" gutterBottom>Trips List</Typography>
            </CardContent>
            <CardActions>
                <Link to={`${pathname}/tripdetails`}>Jump to Detailed Page</Link>
            </CardActions>
        </Card>
    );
};

export default TripListCard;