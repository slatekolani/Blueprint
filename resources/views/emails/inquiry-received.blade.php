<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Request received</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0f172a;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        {{-- Header --}}
        <tr>
          <td style="background:#073B7A;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#93c5fd;">BluePrint Group</p>
            <h1 style="margin:10px 0 0;font-size:22px;font-weight:900;color:#ffffff;line-height:1.2;">Request Received</h1>
          </td>
        </tr>

        {{-- Body --}}
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
              Hi <strong>{{ $inquiry->name }}</strong>,
            </p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
              Thank you for reaching out to <strong>{{ $inquiry->company?->short_name ?? $inquiry->company?->name ?? 'us' }}</strong>.
              We have received your request and a member of our team will get back to you as soon as possible.
            </p>

            {{-- Summary box --}}
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin:24px 0;">
              <tr>
                <td style="padding:24px 28px;">
                  <p style="margin:0 0 6px;font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#94a3b8;">Your request summary</p>
                  @if($inquiry->subject)
                  <p style="margin:12px 0 0;font-size:13px;font-weight:700;color:#0f172a;">{{ $inquiry->subject }}</p>
                  @endif
                  <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#475569;">{{ $inquiry->message }}</p>
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
                  <p style="margin:0;font-size:12px;color:#64748b;line-height:1.8;">
                    <strong>Phone:</strong> {{ $inquiry->phone }}<br>
                    @if($inquiry->organization)<strong>Organization:</strong> {{ $inquiry->organization }}<br>@endif
                    <strong>Company:</strong> {{ $inquiry->company?->name ?? 'BluePrint Group' }}
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
              If you have any questions in the meantime, feel free to reach us at
              <a href="mailto:{{ $inquiry->company?->email ?? config('mail.from.address') }}" style="color:#073B7A;font-weight:700;">{{ $inquiry->company?->email ?? config('mail.from.address') }}</a>
              or call us on <strong>{{ $inquiry->company?->phone ?? '+255 754 444 010' }}</strong>.
            </p>
          </td>
        </tr>

        {{-- Footer --}}
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
              BluePrint Group &bull; Mbezi Beach, Tangi Bovu, Dar es Salaam<br>
              &copy; {{ date('Y') }} BluePrint Group. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
