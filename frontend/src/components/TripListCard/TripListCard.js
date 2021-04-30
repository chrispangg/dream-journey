import React from 'react';
import { makeStyles, Card, CardContent, Typography } from '@material-ui/core';
import styles from "./TripList.module.css"
import TripSummary from "../TripSummary/TripSummary.component";

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
    return (
        <Card className={ materialClass.root + " " + styles.card }>
            <CardContent>
                <Typography className={ materialClass.title } color="textSecondary" gutterBottom>Your Trips</Typography>
                <TripSummary />
            </CardContent>
        </Card>
    );
};

export default TripListCard;