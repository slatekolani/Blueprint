<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_unless($user?->is_active, 403, 'This account is inactive.');
        abort_unless($user->isSuperAdmin() || $user->company_id, 403, 'This account has not been assigned to a company.');

        return $next($request);
    }
}
