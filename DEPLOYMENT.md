# Deployment Guide for EduBook

This guide covers deploying EduBook to production using Vercel for the frontend and Railway/Render for the backend.

## Prerequisites

- GitHub repository with your code
- Vercel account
- Railway or Render account
- Supabase project configured

## Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory

### Step 2: Configure Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-app.vercel.app`

## Backend Deployment (Railway)

### Step 1: Connect Repository to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder

### Step 2: Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8000
NODE_ENV=production
```

### Step 3: Configure Build Settings

Railway will automatically detect it's a Node.js project. Ensure your `package.json` has:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

### Step 4: Deploy

1. Railway will automatically build and deploy
2. Your API will be available at `https://your-app.railway.app`

## Backend Deployment (Render - Alternative)

### Step 1: Connect Repository to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository

### Step 2: Configure Service

- **Name**: `edubook-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Environment Variables

Add the same environment variables as Railway:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8000
NODE_ENV=production
```

## Database Configuration

### Update Supabase Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Update **Site URL** to your Vercel domain
4. Add **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/auth/login`

### Update CORS Settings

1. Go to **Settings** → **API**
2. Add your frontend domain to allowed origins

## Testing Deployment

### Test Frontend
1. Visit your Vercel URL
2. Test user registration/login
3. Test course creation and enrollment
4. Test responsive design on mobile

### Test Backend API
```bash
# Test health endpoint
curl https://your-backend.railway.app/

# Test with authentication
curl -H "Authorization: Bearer your-jwt-token" \
     https://your-backend.railway.app/courses
```

## Production Considerations

### Performance Optimization

1. **Frontend**:
   - Enable Vercel Analytics
   - Configure CDN caching
   - Optimize images with Next.js Image component

2. **Backend**:
   - Enable connection pooling
   - Set up monitoring and logging
   - Configure rate limiting

### Security

1. **Environment Variables**: Never commit secrets to repository
2. **HTTPS**: Ensure all traffic uses HTTPS
3. **CORS**: Configure proper CORS policies
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Set up error tracking and monitoring

### Monitoring

1. **Vercel Analytics**: Monitor frontend performance
2. **Railway/Render Logs**: Monitor backend logs
3. **Supabase Dashboard**: Monitor database usage
4. **Error Tracking**: Consider Sentry or similar service

## Domain Configuration (Optional)

### Custom Domain Setup

1. **Vercel**:
   - Go to project settings
   - Add custom domain
   - Configure DNS records

2. **SSL Certificates**: Automatically handled by Vercel

### DNS Configuration

```
# Example DNS records
your-domain.com     A    76.76.19.19
api.your-domain.com CNAME your-backend.railway.app
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in deployment platform
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation succeeds

2. **Environment Variables**:
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no typos in values

3. **Database Connection**:
   - Verify Supabase URL and keys are correct
   - Check network connectivity
   - Ensure RLS policies allow necessary operations

4. **CORS Errors**:
   - Update CORS settings in Supabase
   - Verify frontend URL is whitelisted
   - Check API endpoints are accessible

### Debugging Tools

```bash
# Check deployment logs
vercel logs your-deployment-url

# Test API endpoints
curl -v https://your-backend.railway.app/health

# Check database connection
psql -h db.your-project.supabase.co -U postgres -d postgres
```

## Backup and Recovery

### Database Backups

1. **Automatic**: Supabase provides automatic backups
2. **Manual**: Export database schema and data
3. **Point-in-time**: Supabase Pro provides point-in-time recovery

### Code Backups

1. **Git**: Primary backup via GitHub
2. **Local**: Keep local copies of important configurations
3. **Documentation**: Maintain deployment documentation

## Scaling Considerations

### Horizontal Scaling

1. **Frontend**: Vercel automatically scales
2. **Backend**: Consider load balancing for high traffic
3. **Database**: Supabase handles scaling automatically

### Performance Monitoring

1. **Metrics**: Monitor response times and error rates
2. **Alerts**: Set up alerts for critical issues
3. **Optimization**: Regular performance reviews and optimizations

---

For additional support, refer to the platform-specific documentation or create an issue in the project repository.
