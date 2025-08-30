import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

export default function DebugInfo() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/summary']
  });

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-2">
          <div>
            <strong>API Status:</strong> {isLoading ? 'Loading...' : error ? 'Error' : 'Success'}
          </div>
          {error && (
            <div className="text-red-600">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          {summary && (
            <div>
              <strong>Data:</strong> {JSON.stringify(summary, null, 2).substring(0, 200)}...
            </div>
          )}
          <div>
            <strong>Tailwind Classes Test:</strong>
            <div className="flex space-x-2 mt-1">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <div className="w-4 h-4 bg-rakuten-pink rounded"></div>
              <div className="w-4 h-4 bg-rakuten-blue rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}