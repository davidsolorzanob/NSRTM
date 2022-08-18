import { Route } from '@angular/router';
import { ActivitiesComponent } from 'app/modules/admin/activities/activities.component';
import { ActivitiesResolver } from 'app/modules/admin/activities/activities.resolvers';

export const activitiesRoutes: Route[] = [
    {
        path     : '',
        component: ActivitiesComponent,
        resolve  : {
            activities: ActivitiesResolver
        }
    }
];
