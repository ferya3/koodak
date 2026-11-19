@php
    $fa = fn ($v) => strtr((string) $v, ['0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴', '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹']);
    $jdate = fn ($d) => (new IntlDateFormatter('fa_IR@calendar=persian', IntlDateFormatter::LONG, IntlDateFormatter::NONE, 'Asia/Tehran', IntlDateFormatter::TRADITIONAL))->format($d);
    $wday = fn ($d) => (new IntlDateFormatter('fa_IR@calendar=persian', IntlDateFormatter::NONE, IntlDateFormatter::NONE, 'Asia/Tehran', IntlDateFormatter::TRADITIONAL, 'EEEE'))->format($d);
    $typeLabel = ['game' => 'بازی', 'story' => 'قصه', 'drawing' => 'نقاشی', 'worksheet' => 'کاربرگ', 'lesson' => 'درس'];
    $maxMin = max(1, ...array_column($data['weeklyMinutes'], 'minutes'));
    $limit = $data['settings']['dailyLimitMinutes'] ?? null;
@endphp
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<title>گزارش {{ $data['child']['displayName'] }}</title>
<style>
  @font-face { font-family: Vazirmatn; src: url(data:font/woff2;base64,{{ $font }}) format("woff2"); font-weight: 100 900; }
  @page { size: A4; margin: 12mm 12mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Vazirmatn, Tahoma, sans-serif; color: #0f1b2d; line-height: 1.75; margin: 0; font-size: 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .head { display: flex; justify-content: space-between; align-items: center; border-radius: 16px; background: #fff3c4; padding: 14px 18px; border: 2px solid #1f1a3d; }
  .brand { font-weight: 900; font-size: 20px; direction: ltr; } .brand span:nth-child(1){color:#f2553f}.brand span:nth-child(2){color:#1f96e0}
  h1 { font-size: 20px; margin: 0; font-weight: 900; } h2 { font-size: 14px; margin: 22px 0 8px; font-weight: 800; }
  .muted { color: #64748b; font-size: 11px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; }
  .kpi { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 12px; } .kpi b { display: block; font-size: 18px; font-weight: 800; }
  .week { display: flex; align-items: flex-end; gap: 10px; height: 130px; border-bottom: 1px solid #cbd5e1; padding: 0 6px; position: relative; }
  .day { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
  .day i { display: block; width: 60%; max-width: 26px; background: #1fa396; border-radius: 4px 4px 0 0; }
  .day small { font-size: 10px; color: #334155; } .day em { font-style: normal; font-size: 10px; font-weight: 700; }
  .limit { position: absolute; left: 0; right: 0; border-top: 1.5px dashed #f2553f; }
  .limit span { position: absolute; left: 0; top: -14px; font-size: 9px; color: #a62e1c; font-weight: 700; }
  .labels { display: flex; gap: 10px; padding: 0 6px; } .labels div { flex: 1; text-align: center; font-size: 10px; color: #64748b; }
  .row { display: grid; grid-template-columns: 120px 1fr 36px 70px; gap: 8px; align-items: center; margin-bottom: 6px; }
  .bar { height: 8px; background: #f1f5f9; border-radius: 4px; } .bar span { display: block; height: 100%; background: #1fa396; border-radius: 4px; }
  .trend { font-size: 10px; border-radius: 99px; padding: 0 6px; text-align: center; } .up{background:#ddf7e3;color:#1a6b34}.down{background:#ffe1dc;color:#a62e1c}.flat{background:#f1f5f9;color:#334155}
  table { width: 100%; border-collapse: collapse; font-size: 11px; } td, th { border-bottom: 1px solid #e2e8f0; padding: 5px 6px; text-align: right; } th { color: #64748b; font-weight: 500; }
  .note { background: #f8fafc; border-radius: 10px; padding: 8px 12px; font-size: 10px; color: #64748b; margin-top: 8px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .foot { margin-top: 24px; text-align: center; font-size: 9px; color: #94a3b8; }
  tr, .row, .kpi { break-inside: avoid; }
</style>
</head>
<body>
  <div class="head">
    <div>
      <h1>گزارش {{ $report->report_type === 'monthly' ? 'ماهانه' : 'هفتگی' }} · {{ $data['child']['displayName'] }} ({{ $fa($data['child']['age']) }} ساله)</h1>
      <div class="muted">{{ $jdate($report->period_start) }} تا {{ $jdate($report->period_end) }}</div>
    </div>
    <div class="brand"><span>Kids</span><span>World</span></div>
  </div>

  <div class="kpis">
    <div class="kpi">زمان استفاده<b>{{ $fa($data['kpis']['totalMinutes']) }} دقیقه</b><span class="muted">میانگین روزانه {{ $fa($data['kpis']['avgMinutesPerDay']) }}</span></div>
    <div class="kpi">فعالیت‌ها<b>{{ $fa($activities->count()) }}</b><span class="muted">در بازه‌ی گزارش</span></div>
    <div class="kpi">روزهای پیاپی<b>{{ $fa($data['kpis']['streakDays']) }}</b><span class="muted">پیوستگی یادگیری</span></div>
    <div class="kpi">امتیاز کل<b>{{ $fa($data['kpis']['points']) }}</b><span class="muted">{{ $data['kpis']['daysOverLimit'] ? $fa($data['kpis']['daysOverLimit']).' روز بیش از سقف' : 'همه‌ی روزها در محدوده' }}</span></div>
  </div>

  <h2>زمان استفاده در ۷ روز اخیر (دقیقه)</h2>
  <div class="week">
    @if ($limit && $limit <= $maxMin * 1.1)
      <div class="limit" style="bottom: {{ min(100, $limit / ($maxMin * 1.15) * 100) }}%"><span>سقف {{ $fa($limit) }}</span></div>
    @endif
    @foreach ($data['weeklyMinutes'] as $d)
      <div class="day"><em>{{ $fa($d['minutes']) }}</em><i style="height: {{ $d['minutes'] / ($maxMin * 1.15) * 100 }}%"></i></div>
    @endforeach
  </div>
  <div class="labels">@foreach ($data['weeklyMinutes'] as $d)<div>{{ $wday(new DateTime($d['date'])) }}</div>@endforeach</div>

  <div class="cols">
    <div>
      <h2>مهارت‌های تمرین‌شده</h2>
      @forelse ($data['skills'] as $s)
        <div class="row">
          <span>{{ $s['title'] }}</span>
          <div class="bar"><span style="width: {{ $s['score'] }}%"></span></div>
          <b>{{ $fa($s['score']) }}</b>
          <span class="trend {{ $s['trend'] }}">{{ ['up' => '↑ رو به رشد', 'down' => '↓ تمرین کمتر', 'flat' => '→ ثابت'][$s['trend']] }}</span>
        </div>
      @empty
        <p class="muted">هنوز داده‌ای ثبت نشده است.</p>
      @endforelse
      <div class="note">این اعداد «مشاهده‌ی تمرین» هستند، نه سنجش استعداد یا هوش. نمونه‌های کم را با احتیاط تفسیر کنید.</div>
    </div>
    <div>
      <h2>تفکیک زمان</h2>
      @foreach ($data['minutesByType'] as $t)
        <div class="row" style="grid-template-columns: 70px 1fr 50px">
          <span>{{ $typeLabel[$t['type']] ?? $t['type'] }}</span>
          <div class="bar"><span style="width: {{ $t['minutes'] / max(1, $data['minutesByType'][0]['minutes']) * 100 }}%"></span></div>
          <b>{{ $fa($t['minutes']) }} د</b>
        </div>
      @endforeach
      @if (count($data['recommendations']))
        <h2>پیشنهاد برای هفته‌ی بعد</h2>
        <ul style="margin:0;padding-right:16px">@foreach ($data['recommendations'] as $r)<li>{{ $r['content']['title'] }} <span class="muted">— {{ $fa($r['reason']) }}</span></li>@endforeach</ul>
      @endif
    </div>
  </div>

  <h2>فعالیت‌ها</h2>
  <table>
    <tr><th>فعالیت</th><th>نوع</th><th>روز</th><th>مدت</th><th>نتیجه</th></tr>
    @forelse ($activities as $a)
      <tr>
        <td>{{ $fa($a->title) }}</td>
        <td>{{ $typeLabel[$a->activity_type] ?? $a->activity_type }}</td>
        <td>{{ $jdate($a->started_at) }}</td>
        <td>{{ $fa(max(1, round($a->duration_seconds / 60))) }} دقیقه</td>
        <td>{{ isset($a->result['stars']) ? str_repeat('★', (int) $a->result['stars']) : '' }}</td>
      </tr>
    @empty
      <tr><td colspan="5" class="muted">در این بازه فعالیتی ثبت نشده است.</td></tr>
    @endforelse
  </table>

  <div class="foot">KidsWorld · این گزارش فقط برای والدین است و شامل هیچ اطلاعات شناسایی‌کننده‌ای جز نام نمایشی نیست · {{ $jdate(now()) }}</div>
</body>
</html>
