<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<title>گزارش {{ $data['child']['displayName'] }} · {{ $report->period_start->toDateString() }} تا {{ $report->period_end->toDateString() }}</title>
<style>
  @page { size: A4; margin: 14mm; }
  body { font-family: Vazirmatn, Tahoma, sans-serif; color: #0f1b2d; line-height: 1.8; }
  h1 { font-size: 22px; margin: 0 } h2 { font-size: 16px; margin: 24px 0 8px; }
  .muted { color: #64748b; font-size: 12px }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px }
  .kpi { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px } .kpi b { display: block; font-size: 18px }
  .bar { height: 8px; background: #f1f5f9; border-radius: 4px } .bar span { display: block; height: 100%; background: #1fa396; border-radius: 4px }
  table { width: 100%; border-collapse: collapse; font-size: 12px } td, th { border-bottom: 1px solid #e2e8f0; padding: 6px; text-align: right }
  .note { background: #f8fafc; border-radius: 8px; padding: 10px; font-size: 11px; color: #64748b }
</style>
</head>
<body>
  <h1>گزارش {{ $report->report_type === 'monthly' ? 'ماهانه' : 'هفتگی' }} · {{ $data['child']['displayName'] }} ({{ $data['child']['age'] }} ساله)</h1>
  <p class="muted">{{ $report->period_start->toDateString() }} تا {{ $report->period_end->toDateString() }} · KidsWorld</p>

  <div class="kpis">
    <div class="kpi">زمان استفاده<b>{{ $data['kpis']['totalMinutes'] }} دقیقه</b></div>
    <div class="kpi">فعالیت‌ها<b>{{ $activities->count() }}</b></div>
    <div class="kpi">روزهای پیاپی<b>{{ $data['kpis']['streakDays'] }}</b></div>
    <div class="kpi">امتیاز کل<b>{{ $data['kpis']['points'] }}</b></div>
  </div>

  <h2>مهارت‌های تمرین‌شده</h2>
  @forelse ($data['skills'] as $s)
    <div style="margin-bottom:8px">{{ $s['title'] }} — {{ $s['score'] }} <span class="muted">({{ $s['sampleCount'] }} فعالیت)</span>
      <div class="bar"><span style="width: {{ $s['score'] }}%"></span></div></div>
  @empty
    <p class="muted">هنوز داده‌ای ثبت نشده است.</p>
  @endforelse
  <p class="note">این اعداد «مشاهده‌ی تمرین» هستند، نه سنجش استعداد یا هوش.</p>

  <h2>فعالیت‌ها</h2>
  <table>
    <tr><th>فعالیت</th><th>نوع</th><th>تاریخ</th><th>مدت</th></tr>
    @foreach ($activities as $a)
      <tr><td>{{ $a->title }}</td><td>{{ $a->activity_type }}</td><td>{{ $a->started_at->toDateString() }}</td><td>{{ max(1, round($a->duration_seconds / 60)) }} دقیقه</td></tr>
    @endforeach
  </table>

  @if (count($data['recommendations']))
    <h2>پیشنهاد برای هفته‌ی بعد</h2>
    <ul>@foreach ($data['recommendations'] as $r)<li>{{ $r['content']['title'] }} — <span class="muted">{{ $r['reason'] }}</span></li>@endforeach</ul>
  @endif
</body>
</html>
