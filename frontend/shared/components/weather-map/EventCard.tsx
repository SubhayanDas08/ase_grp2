import '../../styles/EventCard.module.css';

interface EventCardProps {
    eventTitle: string;
    eventDescription: string;
    eventTime: string;
}

const EventCard = ({eventTitle,eventDescription,eventTime}:EventCardProps)=>{
    return (
        <div className="event-card">
          <div className="event-title">{eventTitle}</div>
          <div className="event-description">{eventDescription}</div>
          <div className="event-time">{eventTime}</div>
        </div>
      );
}

export default EventCard;